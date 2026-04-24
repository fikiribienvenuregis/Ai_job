# Umurava AI Recruitment Screening System — Project Structure

## Repository Layout

```
umurava-recruitment/
├── README.md
├── .gitignore
│
├── frontend/                          # Next.js 14 App Router
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   ├── .env.local                     # NEXT_PUBLIC_API_URL
│   │
│   ├── public/
│   │   └── logo.svg
│   │
│   └── src/
│       ├── app/
│       │   ├── layout.tsx             # Root layout + fonts
│       │   ├── page.tsx               # Landing → redirect to /dashboard
│       │   ├── globals.css
│       │   │
│       │   ├── dashboard/
│       │   │   └── page.tsx           # Main recruiter dashboard
│       │   │
│       │   ├── jobs/
│       │   │   ├── page.tsx           # Jobs list
│       │   │   ├── new/
│       │   │   │   └── page.tsx       # Create job form
│       │   │   └── [id]/
│       │   │       └── page.tsx       # Job detail + candidates
│       │   │
│       │   ├── candidates/
│       │   │   └── upload/
│       │   │       └── page.tsx       # CSV / JSON / PDF upload
│       │   │
│       │   └── results/
│       │       └── [jobId]/
│       │           └── page.tsx       # Ranked results + explanations
│       │
│       ├── components/
│       │   ├── ui/                    # Reusable primitives
│       │   │   ├── Button.tsx
│       │   │   ├── Card.tsx
│       │   │   ├── Badge.tsx
│       │   │   ├── Input.tsx
│       │   │   ├── Select.tsx
│       │   │   ├── Spinner.tsx
│       │   │   └── Modal.tsx
│       │   │
│       │   ├── layout/
│       │   │   ├── Navbar.tsx
│       │   │   ├── Sidebar.tsx
│       │   │   └── PageHeader.tsx
│       │   │
│       │   ├── jobs/
│       │   │   ├── JobForm.tsx        # Create / edit job
│       │   │   ├── JobCard.tsx        # Summary card
│       │   │   └── JobList.tsx
│       │   │
│       │   ├── candidates/
│       │   │   ├── UploadZone.tsx     # Drag-and-drop file upload
│       │   │   ├── CandidateTable.tsx
│       │   │   └── CandidateCard.tsx
│       │   │
│       │   └── results/
│       │       ├── RankedList.tsx     # Top-10/20 ranked candidates
│       │       ├── ScoreBadge.tsx     # Colour-coded score
│       │       ├── ExplanationPanel.tsx  # Expandable per-candidate
│       │       └── ScreeningButton.tsx   # Trigger + loading state
│       │
│       ├── hooks/
│       │   ├── useJobs.ts
│       │   ├── useCandidates.ts
│       │   └── useScreening.ts
│       │
│       ├── lib/
│       │   ├── api.ts                 # Axios / fetch wrapper
│       │   └── utils.ts              # cn(), formatDate(), etc.
│       │
│       └── types/
│           ├── job.ts
│           ├── candidate.ts
│           └── screening.ts
│
│
└── backend/                           # Node.js + Express + TypeScript
    ├── package.json
    ├── tsconfig.json
    ├── .env                           # PORT, MONGO_URI, GEMINI_API_KEY
    ├── Dockerfile                     # For Render deployment
    │
    └── src/
        ├── index.ts                   # Server entry point
        ├── app.ts                     # Express app setup + middleware
        │
        ├── config/
        │   ├── db.ts                  # MongoDB Atlas connection (Mongoose)
        │   └── gemini.ts             # Gemini client initialisation
        │
        ├── models/                    # Mongoose schemas
        │   ├── Job.ts                 # jobs collection
        │   ├── Candidate.ts           # candidates collection
        │   └── ScreeningResult.ts     # screening_results collection
        │
        ├── controllers/
        │   ├── jobController.ts
        │   ├── candidateController.ts
        │   └── screeningController.ts
        │
        ├── services/
        │   ├── jobService.ts
        │   ├── candidateService.ts
        │   ├── csvParserService.ts    # Parses uploaded CSV files
        │   ├── pdfParserService.ts    # Basic resume text extraction
        │   └── geminiService.ts       # Prompt engineering + Gemini call
        │
        ├── routes/
        │   ├── index.ts               # Mount all routers
        │   ├── jobRoutes.ts
        │   ├── candidateRoutes.ts
        │   └── screeningRoutes.ts
        │
        ├── middleware/
        │   ├── upload.ts              # Multer config (CSV + PDF)
        │   ├── errorHandler.ts        # Global error middleware
        │   └── validateRequest.ts     # Zod validation middleware
        │
        ├── utils/
        │   ├── logger.ts              # Winston logger
        │   ├── responseHelper.ts      # Standard API response shape
        │   └── scoreCalculator.ts     # Weighted scoring helper
        │
        └── data/
            ├── sample_job.json
            └── sample_candidates.json  # 20 sample candidates (Kaggle-inspired)
```

---

## Tech Stack Summary

| Layer        | Technology                          | Hosting     |
|--------------|-------------------------------------|-------------|
| Frontend     | Next.js 14, TypeScript, Tailwind    | Vercel      |
| Backend      | Node.js, Express, TypeScript        | Render      |
| Database     | MongoDB Atlas (Mongoose ODM)        | Atlas Cloud |
| AI           | Google Gemini 1.5 Flash API         | Google AI   |
| File upload  | Multer (CSV + PDF)                  | Backend     |
| PDF parsing  | pdf-parse                           | Backend     |
| CSV parsing  | csv-parse                           | Backend     |
| Validation   | Zod                                 | Backend     |
| Auth (opt.)  | NextAuth.js                         | Frontend    |

---

## API Endpoints

| Method | Route                          | Description                          |
|--------|--------------------------------|--------------------------------------|
| POST   | /api/jobs                      | Create a new job                     |
| GET    | /api/jobs                      | List all jobs                        |
| GET    | /api/jobs/:id                  | Get job by ID                        |
| POST   | /api/candidates/upload         | Upload CSV or JSON candidates        |
| POST   | /api/candidates/upload-resume  | Upload PDF resume(s)                 |
| GET    | /api/candidates?jobId=         | List candidates for a job            |
| POST   | /api/screen/:jobId             | Trigger AI screening for a job       |
| GET    | /api/results/:jobId            | Get ranked screening results         |

---

## Environment Variables

### Frontend `.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend `.env`
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/umurava
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

---

## Dataset Note

The sample candidate data is inspired by the **Kaggle Resume Dataset**
(search: "Resume Dataset" on kaggle.com). Fields used:
- `Category` → mapped to skills/domain
- `Resume_str` → parsed for skills, experience years, education, projects

The `data/sample_candidates.json` file ships with 20 pre-processed candidates
across 5 categories: Data Science, Java Developer, Python Developer,
DevOps Engineer, and Full Stack Developer.
