from fastapi import FastAPI, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import requests
import numpy as np
import os
from typing import Optional, List
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS

IS_PRODUCTION = os.getenv("ENV") == "production"
API_BASE_URL = os.getenv("VITE_API_BASE_URL", "http://localhost:3000")

if not IS_PRODUCTION:
    from sentence_transformers import SentenceTransformer, util
    import torch
    import pickle
    import psutil
    model = SentenceTransformer('all-MiniLM-L6-v2')
    embedding_path = "opportunity_vecs.pkl"

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        response = requests.get(f"{API_BASE_URL}/opportunities")
        response.raise_for_status()
        opps = response.json()
        print(f"✅ Loaded {len(opps)} opportunities")

        for opp in opps:
            opp["text"] = " | ".join(filter(None, [
                f"Name: {opp.get('name')}",
                f"Description: {opp.get('description')}",
                f"Tags: {'; '.join(opp.get('tags', []))}",
                f"Skills: {'; '.join(opp.get('skills', []))}",
                f"Requirements: {'; '.join(opp.get('requirements', []))}",
                f"Location: {opp.get('location') or 'Remote'}",
                f"Date: {opp.get('date')}",
                f"Points: {opp.get('points')} points" if opp.get('points') else None,
                f"Volunteers Needed: {opp.get('volunteersNeeded')}" if opp.get('volunteersNeeded') else None,
                f"Organization: {opp.get('organization', {}).get('name')}",
            ])).strip()

        app.state.opps = opps

        if not IS_PRODUCTION:
            if os.path.exists(embedding_path):
                with open(embedding_path, "rb") as f:
                    opportunity_vecs = pickle.load(f).astype(np.float16)
            else:
                texts = [opp["text"] for opp in opps]
                vecs = []
                print(f"📦 Encoding {len(texts)} opportunities in batches of 50")
                for i in range(0, len(texts), 50):
                    batch = texts[i:i+50]
                    batch_vecs = model.encode(batch, convert_to_numpy=True).astype(np.float16)
                    vecs.append(batch_vecs)
                    mem_mb = psutil.Process(os.getpid()).memory_info().rss / 1024 / 1024
                    print(f"🧠 Batch {i//50 + 1}: Memory used = {mem_mb:.2f} MB")
                opportunity_vecs = np.vstack(vecs)
                with open(embedding_path, "wb") as f:
                    pickle.dump(opportunity_vecs, f)
            app.state.opportunity_vecs = torch.tensor(opportunity_vecs, dtype=torch.float32)

    except Exception as e:
        print("❌ Startup failed:", e)
        app.state.opps = []
        if not IS_PRODUCTION:
            app.state.opportunity_vecs = torch.zeros((1, 384), dtype=torch.float32)

    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://volunteergo.onrender.com", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserProfile(BaseModel):
    skills: List[str]
    training: List[str]
    interests: List[str]
    saved_opportunities: List[int]

class SearchRequest(BaseModel):
    search_prompt: str
    user_profile: Optional[UserProfile] = None

def keyword_match_score(opp, keywords):
    name_text = opp["name"].lower()
    desc_text = (opp.get("description") or "").lower()
    tags_text = " ".join(opp.get("tags", [])).lower()
    skills_text = " ".join(opp.get("skills", [])).lower()
    requirements_text = " ".join(opp.get("requirements", [])).lower()
    location_text = (opp.get("location") or "").lower()
    org_name_text = (opp.get("organization", {}).get("name") or "").lower()

    score = 0
    for kw in keywords:
        if kw in name_text:
            score += 3
        if kw in desc_text:
            score += 1
        if kw in tags_text:
            score += 2
        if kw in skills_text:
            score += 2
        if kw in requirements_text:
            score += 1
        if kw in location_text:
            score += 3
        if kw in org_name_text:
            score += 1.5
    return score

@app.get("/opps")
def get_opps(request: Request):
    return request.app.state.opps

@app.post("/search")
async def search(request: Request, body: SearchRequest):
    opps = request.app.state.opps
    user_profile = body.user_profile or UserProfile(skills=[], training=[], interests=[], saved_opportunities=[])
    keywords = [word for word in body.search_prompt.lower().split() if word not in ENGLISH_STOP_WORDS]
    keyword_scores = [keyword_match_score(opp, keywords) for opp in opps]
    max_keyword_score = max(keyword_scores) or 1

    if IS_PRODUCTION:
        final_scores = [ks / max_keyword_score for ks in keyword_scores]
    else:
        combined_vec = build_user_vector(body.search_prompt, user_profile, opps)
        combined_vec_tensor = torch.tensor(combined_vec, dtype=torch.float32)
        vector_scores = util.pytorch_cos_sim(combined_vec_tensor, request.app.state.opportunity_vecs).squeeze().tolist()
        final_scores = [vs + 0.4 * (ks / max_keyword_score) for vs, ks in zip(vector_scores, keyword_scores)]

    top_indices = sorted(range(len(final_scores)), key=lambda i: final_scores[i], reverse=True)

    recommendations = []
    for i in top_indices[:75]:
        if opps[i]["id"] not in user_profile.saved_opportunities:
            rec = dict(opps[i])
            rec["score"] = final_scores[i]
            recommendations.append(rec)

    return {"recommendations": recommendations}

# Only used in dev
def normalize(vec):
    norm = np.linalg.norm(vec)
    return vec if norm == 0 else vec / norm

# Only used in dev
def build_user_vector(search_prompt: str, user_profile: UserProfile, opps):
    skills_vec = normalize(model.encode(" ".join(user_profile.skills), convert_to_numpy=True)) if user_profile.skills else np.zeros(384)
    training_vec = normalize(model.encode(" ".join(user_profile.training), convert_to_numpy=True)) if user_profile.training else np.zeros(384)
    interests_vec = normalize(model.encode(" ".join(user_profile.interests), convert_to_numpy=True)) if user_profile.interests else np.zeros(384)
    user_vec = normalize(0.25 * skills_vec + 0.15 * training_vec + 0.6 * interests_vec)

    saved_texts = [opp["text"] for opp in opps if opp["id"] in user_profile.saved_opportunities]
    saved_vec = normalize(model.encode(" ".join(saved_texts), convert_to_numpy=True)) if saved_texts else np.zeros(384)
    full_user_vec = normalize(0.7 * user_vec + 0.3 * saved_vec)

    search_prompt = search_prompt.strip().lower()
    if not search_prompt:
        return full_user_vec
    search_vec = normalize(model.encode(search_prompt, convert_to_numpy=True))
    return normalize(0.1 * full_user_vec + 0.9 * search_vec)
