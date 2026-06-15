# WAD-and-S-Project

Final Project – Web Application Development and Security

Course Code: COMP6703001

Course Name: Web Application Development and Security

Institution: BINUS University International

---

# 1. Project Information

**Project Title:** Math Problem Solver Application

**Project Domain:** Math Problem Solver Application

**Class:** L4AC

**Group Members:**

| Name | Student ID | Role | GitHub Username |
|------|-----------|------|-----------------|
| Darrus Loamayer | 2802460230 | Full Stack Developer | 2802460230 |
| Edward Liandi | 2702368154 | | Edwardandi |

---

# 2. Instructor & Repository Access

This repository must be shared with:

- **Instructor:** Ida Bagus Kerthyayana Manuaba
  - Email: imanuaba@binus.edu
  - GitHub: bagzcode
- **Instructor Assistant:** Juwono
  - Email: juwono@binus.edu
  - GitHub: Juwono136

---

# 3. Project Overview

## 3.1 Problem Statement

MathMentor addresses the difficulty university students face when trying to understand complex math problems independently. Traditional calculators give answers without explanation. Tutors are expensive and unavailable at 3am before an exam. MathMentor solves this by providing AI-powered step-by-step explanations that teach the reasoning behind each step, not just the final answer.

Target users are university students studying mathematics, calculus, algebra, geometry, and statistics, as well as anyone who needs guided math assistance.

## 3.2 Solution Overview

MathMentor is a full-stack web application that allows users to submit math problems via text or image upload and receive structured step-by-step solutions with plain English explanations. Key features include:

- Step-by-step AI-generated solutions with topic detection
- OCR support for handwritten and printed math problems via image upload
- Hint generation that guides students without revealing the full answer
- Practice problem generation based on the topic of the solved problem
- Problem history and bookmark system for revision
- Admin panel for monitoring users and AI usage

AI is used throughout the core solving pipeline via the Groq API running the LLaMA 4 Scout model for both text solving and image OCR.

---

# 4. Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 App Router, Tailwind CSS |
| Backend | Next.js 14 API Routes (monolith) |
| Database | PostgreSQL on Railway, Prisma ORM v7 |
| Auth | JWT stored in HTTP cookies |
| AI | Groq API (LLaMA 4 Scout — text and vision) |
| Container | Docker, docker-compose |
| CI/CD | GitHub Actions with self-hosted runner |
| Deployment | University remote server (csbihub.id) |
| API Docs | Swagger UI via CDN |
| Testing | Jest, React Testing Library |
| Version Control | GitHub |

---

# 5. System Architecture

## 5.1 Architecture Diagram

![Architecture Diagram](https://github.com/user-attachments/assets/7cf17931-312f-450f-8501-61b588a366c4)

## 5.2 Architecture Explanation

MathMentor is built as a Next.js monolith — both frontend pages and backend API routes live in the same repository and deploy as a single application. This reduces operational complexity for a small team while maintaining clear separation of concerns across layers.

**Layer responsibilities:**

- **Presentation layer** — Next.js pages in `app/` handle UI rendering and user interactions
- **API layer** — Next.js route handlers in `app/api/` receive HTTP requests, validate input, check authentication, and delegate to services
- **Business layer** — Service modules in `services/` contain all business logic including AI calls, password hashing, and data transformation
- **Data access layer** — Prisma ORM in `lib/prisma.ts` provides type-safe database queries
- **Database layer** — PostgreSQL hosted on Railway stores all persistent data

**Where security is enforced:**

- **Middleware** — JWT token verification on every protected route, redirects unauthenticated users
- **API routes** — rate limiting, input sanitization, prompt injection detection before any service call
- **Services** — bcrypt password hashing, structured AI prompts to resist manipulation
- **Database** — Prisma parameterised queries prevent SQL injection, users can only access their own data

---

# 6. API Design

## 6.1 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/register | Register a new user account | No |
| POST | /api/auth/login | Login and receive JWT token | No |
| POST | /api/solve | Submit math problem, receive step-by-step solution | Yes |
| POST | /api/ocr | Upload image, extract math expression | Yes |
| POST | /api/hints | Generate hints for a problem without full solution | Yes |
| POST | /api/practice | Generate practice problems based on topic | Yes |
| GET | /api/history | Retrieve user's solved problem history | Yes |
| GET | /api/bookmarks | Retrieve user's bookmarked problems | Yes |
| POST | /api/bookmarks | Save a problem to bookmarks | Yes |
| DELETE | /api/bookmarks/[id] | Remove a bookmark | Yes |
| GET | /api/profile | Get current user profile | Yes |
| PUT | /api/profile | Update user profile | Yes |
| GET | /api/admin/users | Get all users, AI logs, system logs | Yes (Admin) |
| GET | /api/swagger | Returns OpenAPI spec JSON | No |
| GET | /api/csrf | Generate CSRF token | No |

## 6.2 API Documentation

Swagger UI is available at the live application:

https://e2526-wads-b4ac-04.csbihub.id/api-docs

**Example — POST /api/auth/login:**

Request:
```json
{
  "email": "darrus@mathmentor.com",
  "password": "password123"
}
```

Response 200:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "email": "darrus@mathmentor.com",
  "role": "student"
}
```

**Example — POST /api/solve:**

Request:
```json
{
  "problem": "Solve x² + 5x + 6 = 0"
}
```

Response 200:
```json
{
  "topic": "Algebra",
  "steps": [
    {
      "step": 1,
      "explanation": "Factor the quadratic expression by finding two numbers that multiply to 6 and add to 5",
      "result": "(x + 2)(x + 3) = 0"
    },
    {
      "step": 2,
      "explanation": "Set each factor equal to zero",
      "result": "x + 2 = 0 or x + 3 = 0"
    },
    {
      "step": 3,
      "explanation": "Solve for x in each equation",
      "result": "x = -2 or x = -3"
    }
  ]
}
```

---

# 7. Database Design

## 7.1 Database Choice

PostgreSQL was chosen over MongoDB and Firebase for the following reasons:

- The data is relational — users have problems, problems have solutions, bookmarks link users to problems. A relational database models this naturally with foreign keys and joins.
- Prisma ORM has excellent TypeScript support for PostgreSQL with type-safe queries and automatic migrations.
- Railway provides free hosted PostgreSQL that connects reliably from both local development and the deployed server.
- Firebase was considered for auth only but rejected in favour of custom JWT implementation to demonstrate security knowledge as required by the spec.

## 7.2 Schema / Data Structure

**User** — stores account credentials and role
```
id, email, passwordHash, name, role, createdAt, updatedAt
```

**Problem** — stores submitted math problems
```
id, userId, content, inputType, topic, createdAt
```

**Solution** — stores AI-generated solutions linked to problems
```
id, problemId, steps (JSON), topic, createdAt
```

**Bookmark** — links users to saved problems
```
id, userId, problemId, createdAt
unique constraint: userId + problemId
```

**Feedback** — stores user ratings on solutions
```
id, userId, solutionId, rating, comment, createdAt
```

**ImageUpload** — stores metadata for uploaded images
```
id, problemId, filename, fileType, fileSize, uploadedAt
```

**Relationships:**
- User → has many Problems, Bookmarks, Feedbacks
- Problem → belongs to User, has one Solution, has many Bookmarks
- Solution → belongs to Problem, has many Feedbacks

---

# 8. AI Features

## 8.1 AI Feature List

| AI Feature | Purpose | AI Type |
|-----------|---------|---------|
| Symbolic Problem Solving | Solves math problems step by step with plain English explanations | NLP |
| OCR for Handwritten Math | Extracts mathematical expressions from uploaded images | OCR / Vision |
| Hint Generation | Provides guided hints without revealing the full solution | NLP |
| Concept-Based Practice | Generates practice problems based on the topic of the solved problem | NLP / Recommendation |

## 8.2 AI Integration Flow

**Text solving flow:**
```
User types problem
→ /api/solve
→ sanitizeInput()
→ detectPromptInjection()
→ mathService.solveProblem()
→ Groq API (LLaMA 4 Scout)
→ structured JSON response
→ saved to database
→ returned to frontend
```

**Image solving flow:**
```
User uploads image
→ /api/ocr
→ file type and size validation
→ convert to base64
→ ocrService.extractMathFromImage()
→ Groq Vision API
→ extracted text
→ /api/solve (same text flow as above)
```

**Hints flow:**
```
User clicks Get Hints on dashboard
→ /api/hints
→ mathService.generateHints()
→ Groq API with hint-specific prompt
→ 2-3 hints returned without full solution
```

**Practice flow:**
```
User clicks Practice on results page
→ /api/practice
→ mathService.generatePracticeProblems()
→ Groq API
→ 3 practice problems on same topic returned
```

AI results are stored in the Solution model as structured JSON steps. The frontend reads steps from sessionStorage for immediate display and fetches from the database for history and bookmarks.

---

# 9. Security Implementation

## 9.1 Authentication

JWT tokens are generated on login using the jsonwebtoken library signed with a secret key stored in environment variables. Tokens expire after 24 hours. Tokens are stored in browser cookies with SameSite=Strict to prevent CSRF attacks. Every protected API route verifies the token using getTokenFromRequest() which checks the Authorization header first then falls back to cookies.

## 9.2 Authorization

Role-based access control is implemented at two levels. Middleware checks the JWT token on every request and redirects unauthenticated users to login. The admin panel and /api/admin/users endpoint additionally check that the user role is admin and return 403 Forbidden for student accounts.

## 9.3 Input Validation

All user input goes through three layers of validation. Frontend validation catches empty fields and format errors immediately. API route validation enforces length limits and rejects malformed requests before reaching services. The sanitizeInput() function in lib/sanitize.ts strips HTML tags and encodes dangerous characters to prevent XSS.

## 9.4 Prompt Injection Prevention

The detectPromptInjection() function checks all AI-bound input against known injection patterns including "ignore previous instructions", "act as", "system:", and jailbreak attempts. Matched inputs are rejected with a 400 response before reaching the Groq API. Structured prompts with explicit role instructions provide a secondary defense layer.

## 9.5 SQL Injection Prevention

Prisma ORM uses parameterised queries for all database operations. Raw SQL is never used in the application.

## 9.6 CSRF Protection

CSRF tokens are generated via /api/csrf using crypto.randomBytes and stored in an HttpOnly cookie. The SameSite=Strict cookie attribute on the JWT token provides primary CSRF protection since cross-site requests cannot include same-site cookies.

## 9.7 Rate Limiting

In-memory rate limiting is implemented in lib/rateLimit.ts with per-user and per-IP tracking:
- 10 solve requests per minute per user
- 5 login attempts per minute per IP
- 3 registration attempts per minute per IP

Exceeded limits return 429 Too Many Requests.

## 9.8 Security Headers

The following HTTP security headers are applied to all responses via next.config.ts:

- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()
- Strict-Transport-Security: max-age=63072000; includeSubDomains; preload

## 9.9 API Key Handling

All secrets including DATABASE_URL, JWT_SECRET, and GROQ_API_KEY are stored in environment variables and never committed to the repository. In production they are injected via GitHub Actions secrets into the Docker container at deployment time. The .env file is excluded by .gitignore and .dockerignore.

---

# 10. Testing Documentation

## 10.1 Frontend Testing

| Test Case | Scenario | Expected Result | Status |
|-----------|----------|-----------------|--------|
| FE-01 | | | Pass/Fail |
| FE-02 | | | Pass/Fail |

## 10.2 Backend & API Testing

| Test Case | Endpoint | Input | Expected Output | Status |
|-----------|----------|-------|-----------------|--------|
| API-01 | | | | Pass/Fail |
| API-02 | | | | Pass/Fail |

## 10.3 Security Testing

| Test Case | Attack Type | Expected Behavior | Result |
|-----------|-------------|-------------------|--------|
| SEC-01 | XSS | Input Sanitized | Pass/Fail |
| SEC-02 | Injection | Query Blocked | Pass/Fail |

## 10.4 AI Functionality Testing

**AI Feature: Symbolic Problem Solving**

| Test Case | Input | Expected Output | Actual Result | Status |
|-----------|-------|-----------------|---------------|--------|
| AI-01 | Valid math problem | Step-by-step solution | | Pass/Fail |
| AI-02 | Invalid input (empty) | Error message | | Pass/Fail |
| AI-03 | Prompt injection attempt | Request blocked | | Pass/Fail |

**AI Feature: OCR for Handwritten Math**

| Test Case | Input | Expected Output | Actual Result | Status |
|-----------|-------|-----------------|---------------|--------|
| AI-04 | Clear image of math problem | Extracted math expression | | Pass/Fail |
| AI-05 | Blurry or non-math image | NO_MATH_FOUND error | | Pass/Fail |
| AI-06 | Image with prompt injection text | Sanitized extraction | | Pass/Fail |

**AI Feature: Hint Generation**

| Test Case | Input | Expected Output | Actual Result | Status |
|-----------|-------|-----------------|---------------|--------|
| AI-07 | Valid math problem | 2-3 hints without full answer | | Pass/Fail |
| AI-08 | Empty problem | Error message | | Pass/Fail |
| AI-09 | Prompt injection in problem | Request blocked | | Pass/Fail |

**AI Feature: Practice Problem Generation**

| Test Case | Input | Expected Output | Actual Result | Status |
|-----------|-------|-----------------|---------------|--------|
| AI-10 | Valid topic (Algebra) | 3 practice problems | | Pass/Fail |
| AI-11 | Unknown topic | Generic math problems | | Pass/Fail |
| AI-12 | Prompt injection in topic | Request blocked | | Pass/Fail |

**Failure Handling:**

- If Groq API is unavailable, all AI endpoints return a 503 Service Unavailable response with the message "AI service is currently unavailable. Please try again later."
- If the AI returns malformed JSON, the error is caught in a try/catch block and a 500 Internal Server Error is returned without exposing internal details.
- Timeouts are handled by the Groq SDK's built-in timeout mechanism. Failed requests are caught and return a generic error message to the user.

---

# 11. Deployment & Production Setup

## 11.1 Docker Setup

A multi-stage Dockerfile is included in the repository root:

- Stage 1 (base) — Node.js 22 slim with OpenSSL and CA certificates
- Stage 2 (deps) — installs npm dependencies via npm ci
- Stage 3 (builder) — generates Prisma client and builds Next.js with standalone output
- Stage 4 (runner) — copies only build output into minimal image, runs as non-root user

A docker-compose.yml file orchestrates the container, maps port 3013, injects environment variables at runtime, and configures automatic restart.

A .dockerignore file excludes node_modules, build output, test files, and environment files from the build context.

## 11.2 Production Environment

Environment variables are stored as GitHub repository secrets and never appear in the codebase or Docker image. During deployment, GitHub Actions creates a temporary .env.production file from secrets, passes it to docker compose, and immediately deletes it after the container starts.

The application runs behind Cloudflare which provides HTTPS termination, DDoS protection, and DNS management.

## 11.3 CI/CD Pipeline

A three-stage GitHub Actions pipeline runs on every push to main:

**Stage 1 — Quality** runs on ubuntu-latest, installs dependencies, generates Prisma client with a dummy DATABASE_URL for build-time safety, and runs all Jest tests. Deployment is blocked if any test fails.

**Stage 2 — Build** runs on ubuntu-latest, builds the Docker image using docker/build-push-action, and pushes to Docker Hub under 2802460230/mathmentor:latest with inline caching.

**Stage 3 — Deploy** runs on the self-hosted runner installed on the university server, creates the production env file from secrets, pulls the latest image, restarts the container, and cleans up dangling images.

## 11.4 Live Application URL

https://e2526-wads-b4ac-04.csbihub.id

---

# 12. GitHub Contribution Summary

**Darrus Loamayer (2802460230)**
- Features implemented: All 9 frontend pages, complete REST API with 15 endpoints, JWT authentication system, database schema and Prisma ORM integration, Docker containerisation, GitHub Actions CI/CD pipeline, Swagger API documentation, admin panel
- API endpoints handled: /api/auth/register, /api/auth/login, /api/solve, /api/ocr, /api/hints, /api/practice, /api/history, /api/bookmarks, /api/bookmarks/[id], /api/profile, /api/admin/users, /api/swagger, /api/csrf
- Tests written: 7 Jest test files covering login, register, dashboard, results, history, bookmarks, profile — 32 passing tests
- Security work: JWT middleware, input sanitization, prompt injection detection, rate limiting, CSRF protection, security headers, XSS prevention
- AI-related work: Groq API integration for math solving, OCR vision processing, hint generation, practice problem generation, lazy client initialisation for build safety

**Edward Liandi (2702368154)**
- Features implemented: None
- API endpoints handled: None
- Tests written: None
- Security work: None
- AI-related work: None

Contributions match GitHub commit history.

---

# 13. AI Usage Disclosure

Claude (Anthropic) was used throughout this project as a development assistant for architecture planning, code generation, debugging, and documentation writing. All generated code was reviewed, tested, and adapted to the specific requirements of this project. The student understands all implemented code and can explain every component.

Groq API is used as the AI service powering the application's math solving, OCR, hint generation, and practice problem features.

---

# 14. Known Limitations & Future Improvements

**Current limitations:**
- Rate limiting uses in-memory storage and resets on server restart — a production system would use Redis
- Email verification is not implemented — users can register with any email address
- The admin panel displays basic user and activity data rather than a dedicated structured logging system
- OCR accuracy depends on image quality — blurry or low contrast images may fail to extract correctly
- Groq free tier has request limits that could cause 429 errors under heavy load

**Future improvements:**
- Email verification via Resend or SendGrid
- Redis-based rate limiting for persistence across restarts
- LaTeX rendering for mathematical expressions in solutions
- Dedicated activity logging model with filtering and export
- Mobile application

**AI limitations and risks:**
- Groq LLaMA models occasionally return malformed JSON requiring retry logic
- Prompt injection detection uses pattern matching — sophisticated rephrasing may bypass filters
- AI solutions should be verified by a qualified instructor for academic use
- Model responses vary — the same problem may produce slightly different step breakdowns across requests

---

# 15. Final Declaration

We declare that:
- This project is our own work
- AI usage is disclosed honestly in Section 13
- Darrus Loamayer understands the full system architecture and implementation

Signed by Group Members:
- Darrus Loamayer
- Edward Liandi

---

# 16. Setup

**Prerequisites:**
- Node.js v22 or above
- npm
- PostgreSQL database (Railway recommended)
- Groq API key (free at console.groq.com)

**Local development:**

```bash
git clone https://github.com/2802460230/WAD-and-S-Project.git
cd WAD-and-S-Project/mathmentor
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Create a `.env.local` file with:

```
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Open http://localhost:3000

**Run tests:**

```bash
npm test
```

---

# 17. Deployment Instructions

**Prerequisites:**
- Docker and docker-compose on the target server
- Docker Hub account
- GitHub repository with secrets configured

**GitHub Secrets required:**

```
DOCKER_USERNAME
DOCKER_PASSWORD
DATABASE_URL
JWT_SECRET
GROQ_API_KEY
NODE_ENV
NEXT_PUBLIC_APP_URL
```

**Automatic deployment:**

Push to the main branch. The GitHub Actions pipeline will automatically run tests, build the Docker image, push to Docker Hub, and deploy to the server.

**Manual deployment on server:**

```bash
cat > .env.production << 'EOF'
NODE_ENV=production
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
DOCKER_USERNAME=your_dockerhub_username
EOF

export $(cat .env.production | xargs)
docker compose up -d --no-deps app
rm .env.production
```
