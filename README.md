# VolunteerGo
VolunteerGo is a **gamified volunteer matching platform** that connects volunteers with opportunities based on their **skills, interests, and location**.  
It blends community service with **game-like elements** such as points, badges, and leaderboards to make volunteering more engaging and rewarding.

[![VolunteerGo - 5 August 2025 - Watch Video](https://cdn.loom.com/sessions/thumbnails/5354b615e44840668194fdd97f940cff-34c44f314df6c639-full-play.gif)](https://www.loom.com/share/5354b615e44840668194fdd97f940cff)

---

## 🚀 Features

### 👤 **User Onboarding & Profiles**
- Firebase authentication  
- Personalized onboarding to capture **interests, skills, and location**  
- Fun, game-like profile page with **earned and locked badges**  

### 🔍 **Search & Discovery**
- AI-powered opportunity search using **OpenAI + vector embeddings**  
- Filter, sort, and voice search support  
- Swipe-to-save or swipe-to-skip opportunities  

### 💌 **Save & Apply**
- Save opportunities for later  
- One-click application flow  
- Category-based badge earning during applications  

### 🏆 **Gamification**
- Points system with **level progression**  
- Badge collection (earned and locked states)  
- Leaderboard with friend system  

---

## 🛠 Tech Stack

### **Frontend**
- React + Vite  
- Custom CSS styling  
- Firebase Authentication  

### **Backend**
- Node.js + Express  
- FastAPI (AI search service) with Uvicorn  
- PostgreSQL + Prisma ORM  

### **AI & Data**
- OpenAI embeddings (vector search)  
- scikit-learn, NumPy, sentence-transformers  

### **APIs**
- LocationIQ (geolocation)  
- Pexels (media assets)  
- SendGrid (email notifications)  

---

## 📂 Repository

GitHub: [VolunteerGo](https://github.com/Jandresol/VolunteerGo)

---

## 📽 Demo

Click the GIF above or watch the full video here:  
**[VolunteerGo - 5 August 2025 - Watch Video](https://www.loom.com/share/5354b615e44840668194fdd97f940cff)**

---

## 🚦 Getting Started

### Prerequisites
- Node.js v18+  
- Python 3.10+  
- PostgreSQL database  
- Firebase project with Google sign-in enabled  

### Installation
```bash
# Clone the repository
git clone https://github.com/Jandresol/VolunteerGo.git
cd VolunteerGo

# Install frontend dependencies
cd VolunteerUI
npm install

# Install backend dependencies
cd VolunteerAPI
npm install

# Install AI search service dependencies
cd VolunteerSearch
pip install -r requirements.txt
```
### Running the app
```bash
# Start frontend
cd VolunteerUI
npm run dev

# Start backend
cd VolunteerAPI
npm run dev

# Start AI search
cd VolunteerSearch
uvicorn main:app --reload

```
