# Umurava AI — Recruitment Screening System

An AI-powered recruitment screening platform that uses **Google Gemini 1.5 Flash** to evaluate and rank candidates against job requirements.

---

## Tech Stack

| Layer     | Technology                              | Hosting     |
|-----------|-----------------------------------------|-------------|
| Frontend  | Next.js 14, TypeScript, Tailwind CSS    | Vercel      |
| Backend   | Node.js, Express, TypeScript            | Render      |
| Database  | MongoDB Atlas (Mongoose ODM)            | Atlas Cloud |
| AI Engine | Google Gemini 1.5 Flash API             | Google AI   |
| Upload    | Multer (CSV + PDF)                      | Backend     |
| PDF Parse | pdf-parse                               | Backend     |
| CSV Parse | csv-parse                               | Backend     |
| Validation| Zod                                     | Backend     |

---

## Project Structure

```
umurava-recruitment/
├── backend/          # Node.js + Express API
│   └── src/
│       ├── config/       # DB + Gemini client
│       ├── models/       # Mongoose schemas
│       ├── controllers/  # Request handlers
│       ├── services/     # Business logic + AI
│       ├── routes/       # Express routers
│       ├── middleware/   # Upload, error, validation
│       └── utils/        # Logger, response, scoring
│
└── frontend/         # Next.js 14 App Router
    └── src/
        ├── app/          # Pages (dashboard, jobs, results)
        ├── components/   # UI + layout + feature components
        ├── hooks/        # Data fetching hooks
        ├── lib/          # API client + utilities
        └── types/        # TypeScript interfaces
```

---

## Quick Start

### 1. Prerequisites
- Node.js 20+
- MongoDB Atlas account (free tier works)
- Google AI Studio API key (free at [aistudio.google.com](https://aistudio.google.com))

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in .env values (see below)
npm run dev
```

**`backend/.env`**
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/umurava
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

**`frontend/.env.local`**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Reference

| Method | Endpoint                      | Description                          |
|--------|-------------------------------|--------------------------------------|
| GET    | /api/jobs                     | List all jobs                        |
| POST   | /api/jobs                     | Create a new job                     |
| GET    | /api/jobs/:id                 | Get job by ID                        |
| PUT    | /api/jobs/:id                 | Update a job                         |
| DELETE | /api/jobs/:id                 | Delete a job                         |
| GET    | /api/candidates?jobId=        | List candidates for a job            |
| POST   | /api/candidates/upload        | Upload CSV or JSON file              |
| POST   | /api/candidates/upload-resume | Upload PDF resume(s)                 |
| POST   | /api/screen/:jobId            | Trigger AI screening                 |
| GET    | /api/results/:jobId           | Get ranked screening results         |
| GET    | /health                       | Health check                         |

---

## How AI Screening Works

1. **Job creation** — Recruiter defines required skills, experience, education level
2. **Candidate upload** — Import via CSV/JSON or parse PDF resumes automatically
3. **Gemini evaluation** — Each candidate is evaluated with a structured prompt:
   - Skill match score (0–100)
   - Experience score (0–100)
   - Education score (0–100)
   - Project/domain score (0–100)
4. **Weighted composite score** — Skills 40%, Experience 30%, Education 15%, Projects 15%
5. **Ranked results** — Candidates sorted by score with explanations, strengths, weaknesses, and recommendation label

---

## Sample Data

The `backend/src/data/sample_candidates.json` file contains 20 pre-built candidates across 5 categories:
- **Data Science** (Alice, Frank, Keza, Marie, Sandra)
- **Java Developer** (Bob, Grace, Leon, Robert)
- **Python Developer** (Claire, Henry, Olive)
- **DevOps Engineer** (David, Irene, Patrick)
- **Full Stack Developer** (Eve, James, Nathan, Queen, Tom)

To seed them, create a job first, copy its ID, then use the Upload page or POST directly to `/api/candidates/upload` with the JSON file.

---

## CSV Format

```csv
name,email,phone,skills,experience_years,education,category,resume_text
Alice Doe,alice@example.com,+250788000001,"python,machine learning,sql",5,Master,Data Science,"Experienced data scientist..."
```
yeah man
---

## Deployment

### Backend → Render
1. Push to GitHub
2. Create a new **Web Service** on Render, connect repo
3. Set **Root Directory** to `backend`
4. Build command: `npm install && npm run build`
5. Start command: `node dist/index.js`
6. Add environment variables in Render dashboard

### Frontend → Vercel
1. Import repo on Vercel
2. Set **Root Directory** to `frontend`
3. Add `NEXT_PUBLIC_API_URL=https://your-render-url.onrender.com`
4. Deploy

---

## Scoring Weights

| Dimension  | Weight | Description                              |
|------------|--------|------------------------------------------|
| Skills     | 40%    | Required skill match percentage          |
| Experience | 30%    | Years of experience vs. requirement      |
| Education  | 15%    | Education level match                    |
| Projects   | 15%    | Domain/project relevance                 |

---

## License

MIT — Built for Umurava by the engineering team.
