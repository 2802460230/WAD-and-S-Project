# WAD-and-S-Project <br />

Final Project – Web Application Development and Security <br />
Course Code: COMP6703001 <br />
Course Name: Web Application Development and Security <br />
Institution: BINUS University International <br />

# 1. Project Information <br />
Project Title: <br />
Math Problem Solver Application <br />

Project Domain (choose one): <br />
Math Problem Solver Application <br />

Class: <br />
L4AC <br />

Group Members (Max 3 – same class only):
|Name | Student ID | Role | GitHub Username |
|--------|--------|--------|--------|
|Darrus Loamayer | 2802460230 | | 2802460230 |
|Edward Liandi | 2702368154 | | Edwardandi |

# 2. Instructor & Repository Access <br />
This repository must be shared with: <br />
• Instructor: Ida Bagus Kerthyayana Manuaba <br />
o Email: imanuaba@binus.edu <br />
o GitHub: bagzcode <br />
• Instructor Assistant: Juwono <br />
o Email: juwono@binus.edu <br />
o GitHub: Juwono136 <br />

# 3. Project Overview <br />
## 3.1 Problem Statement <br />
Explain: <br />
• What problem does this application solve? This application helps students and teachers solve math problems. <br />
• Who are the target users? Students, Teachers, etc. <br />

## 3.2 Solution Overview <br />
Briefly describe: <br />
• Main features <br />
• Why this solution is appropriate <br />
• Where AI is used <br />

# 4. Technology Stack <br />
Frontend: Next.js 14 <br />
Backend: Next.js 14 <br />
API: REST via Next.js API routes <br />
Database: PostgreSQL + Prisma <br />
Container: Docker + docker-compose <br />
Deployment: Unsure <br />
Version Control: GitHub <br />
AI: Google Gemini API (free) <br />
Auth: JWT <br />
DNS: Cloudflare <br />

# 5. System Architecture <br />
## 5.1 Architecture Diagram
<img width="738" height="659" alt="image" src="https://github.com/user-attachments/assets/7cf17931-312f-450f-8501-61b588a366c4" />

## 5.2 Architecture Explanation <br />

Frontend ↔ API ↔ Database Interaction:
User submits a math problem (text or image) through the Next.js frontend. The request goes to API routes, which validate the input and authenticate the user via JWT. If it's an image, OCR extracts the text. The problem is saved to PostgreSQL using Prisma, then sent to OpenAI API for solving. The solution is stored in the database and returned to the user.
Separation of Concerns:

Frontend (Next.js): UI components only, no business logic
API Routes: Handle validation, OCR processing, AI calls, and data formatting
Prisma ORM: All database queries, isolated from business logic
External Services: OpenAI and OCR wrapped in service modules

Where Security is Enforced:

Middleware layer: JWT authentication and rate limiting (10 requests/min)
Input validation: Sanitize text input (XSS prevention), validate image files (type/size)
Database: Prisma prevents SQL injection, users can only access their own problems
API keys: Stored in environment variables, never exposed to client


# 6. API Design <br />

## 6.1 API Endpoints <br />

|Method | Endpoint | Description | Auth Required |
|--------|--------|--------|--------|
|GET | | | Yes / No |
|POST | | | Yes / No |
|PUT | | | Yes / No |
|DELETE | | | Yes / No |

## 6.2 API Documentation <br />

Swagger / Postman Link (if available): <br />
Example request & response (JSON):


# 7. Database Design <br />

## 7.1 Database Choice <br />
Explain why you chose: 
• PostgreSQL / MongoDB / Firebase 

## 7.2 Schema / Data Structure <br />
Insert ERD or data structure diagram. 


# 8. AI Features <br />

## 8.1 AI Feature List <br />
Describe at least TWO AI features. 
|AI Feature | Purpose | AI Type |
|--------|--------|--------|
| | | NLP/OCR/Recommendation |
| | | NLP/OCR/Recommendation |
| | | NLP/OCR/Recommendation |

## 8.2 AI Integration Flow <br />
Explain: 
• Input → AI processing → Output 
• How AI results are used in the system 


# 9. Security Implementation <br />
Describe how your project handles: 
• Authentication (JWT / session) 
• Authorization (roles) 
• Input validation 
• Protection against: 
o SQL / NoSQL Injection 
o XSS 
o CSRF 
• Secure API key handling














This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
