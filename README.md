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

Group Members (Max 3 – same class only): <br />
Name Student ID Role GitHub Username <br />
Darrus Loamayer 2802460230 2802460230 <br />
Edward Liandi 2702368154 Edwardandi <br />

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

# 4. Technology Stack
Frontend: Next.js 14
Backend: Next.js 14
API: REST via Next.js API routes
Database: PostgreSQL + Prisma
Container: Docker + docker-compose
Deployment: Unsure
Version Control: GitHub
AI: Google Gemini API (free)
Auth: JWT
DNS: Cloudflare

## 5.1 Architecture Diagram
<img width="738" height="659" alt="image" src="https://github.com/user-attachments/assets/7cf17931-312f-450f-8501-61b588a366c4" />

## 5.2 Architecture Explanation

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
