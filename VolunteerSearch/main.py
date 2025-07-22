from fastapi import FastAPI, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import requests
import numpy as np
import pickle
import os
from sentence_transformers import SentenceTransformer, util
from typing import Optional, List
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS

# Model loading is okay globally
model = SentenceTransformer('all-MiniLM-L6-v2')
embedding_path = "opportunity_vecs.pkl"

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        response = requests.get("http://localhost:3000/opportunities")
        response.raise_for_status()
        opps = response.json()
        print(f"✅ Loaded {len(opps)} opportunities")

        for opp in opps:
            opp["text"] = f"{opp.get('name', '')} {opp.get('description', '')} {' '.join(opp.get('tags', []))}"

        if os.path.exists(embedding_path):
            with open(embedding_path, "rb") as f:
                opportunity_vecs = pickle.load(f)
        else:
            texts = [opp["text"] for opp in opps]
            opportunity_vecs = model.encode(texts, convert_to_numpy=True)
            with open(embedding_path, "wb") as f:
                pickle.dump(opportunity_vecs, f)

        app.state.opps = opps
        app.state.opportunity_vecs = opportunity_vecs
    except Exception as e:
        print("❌ Startup failed:", e)
        app.state.opps = []
        app.state.opportunity_vecs = np.zeros((1, 384))  # Fallback

    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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


def normalize(vec):
    norm = np.linalg.norm(vec)
    return vec if norm == 0 else vec / norm

def build_user_vector(search_prompt: str, user_profile: UserProfile, opps):
    skills_vec = normalize(model.encode(" ".join(user_profile.skills), convert_to_numpy=True)) if user_profile.skills else np.zeros(384)
    training_vec = normalize(model.encode(" ".join(user_profile.training), convert_to_numpy=True)) if user_profile.training else np.zeros(384)
    interests_vec = normalize(model.encode(" ".join(user_profile.interests), convert_to_numpy=True)) if user_profile.interests else np.zeros(384)

    user_vec = normalize(0.25 * skills_vec + 0.15 * training_vec + 0.6 * interests_vec)

    saved_texts = [opp["text"] for opp in opps if opp["id"] in user_profile.saved_opportunities]
    saved_vec = normalize(model.encode(" ".join(saved_texts), convert_to_numpy=True)) if saved_texts else np.zeros(384)

    full_user_vec = normalize(0.9 * user_vec + 0.1 * saved_vec)

    search_prompt = search_prompt.strip().lower()
    if not search_prompt:
        return full_user_vec
    search_vec = normalize(model.encode(search_prompt, convert_to_numpy=True))
    return normalize(0.1 * full_user_vec + 0.9 * search_vec)

def keyword_match_score(opp, keywords):
    text = (opp["name"] + " " + opp["description"] + " " + " ".join(opp["tags"])).lower()
    return sum(1 for kw in keywords if kw in text)

@app.get("/opps")
def get_opps(request: Request):
    return request.app.state.opps

@app.post("/search")
async def search(request: Request, body: SearchRequest):
    opps = request.app.state.opps
    opportunity_vecs = request.app.state.opportunity_vecs

    user_profile = body.user_profile or UserProfile(**user)
    combined_vec = build_user_vector(body.search_prompt, user_profile, opps)
    vector_scores = util.pytorch_cos_sim(combined_vec, opportunity_vecs).squeeze().tolist()

    keywords = [word for word in body.search_prompt.lower().split() if word not in ENGLISH_STOP_WORDS]
    keyword_scores = [keyword_match_score(opp, keywords) for opp in opps]
    max_keyword_score = max(keyword_scores) or 1

    final_scores = [vs + 0 * (ks / max_keyword_score) for vs, ks in zip(vector_scores, keyword_scores)]
    top_indices = sorted(range(len(final_scores)), key=lambda i: final_scores[i], reverse=True)

    recommendations = []
    for i in top_indices[:10]:
        if opps[i]["id"] not in user_profile["saved_opportunities"]:
            recommendations.append({
                "id": opps[i]["id"],
                "name": opps[i]["name"],
                "description": opps[i]["description"],
                "score": final_scores[i],
            })

    return {"recommendations": recommendations}
