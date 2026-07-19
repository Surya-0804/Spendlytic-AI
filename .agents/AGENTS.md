# Spendlytic AI - Agent Instructions

Welcome to the Spendlytic AI project. This document provides essential context, architecture details, and strict rules for any AI agent working on this codebase.

## 1. Project Overview
**Spendlytic AI** is an AI-powered finance analyzer. It allows users to track their incomes, manage budgets, and record expenses. It integrates Gemini AI to provide personalized financial advice based on the user's data.

**Core Tech Stack:**
- **Framework:** Next.js 14 (App Router)
- **Database:** Neon DB (Serverless Postgres) with Drizzle ORM
- **Authentication:** Clerk (`@clerk/nextjs`)
- **UI & Styling:** Tailwind CSS, ShadCN UI, Lucide React, Framer Motion, Recharts
- **AI Integration:** Google Generative AI (Gemini)

## 2. Codebase Architecture
- `src/app/`: The Next.js App Router structure.
  - `(auth)`: Contains Clerk authentication routes.
  - `(routes)/dashboard`: The main authenticated application, containing sub-routes for `budgets`, `expenses`, and `incomes`.
- `src/components/`, `src/lib/`, `src/data/`: Utilities, components, and constants.
- `utils/`: Contains crucial project configurations:
  - `dbConfig.jsx`: Drizzle ORM database connection.
  - `schema.jsx`: Database schemas.
  - `getFinancialAdvice.js`: Gemini AI integration logic.

## 3. Database Schema Overview
The data layer currently consists of three primary entities (defined in `utils/schema.jsx`):
- `Budgets`: User-defined budgets (name, amount, icon).
- `Incomes`: User-defined income streams (name, amount, icon).
- `Expenses`: User expenses, linked to specific budgets via `budgetId`.

## 4. STRICT RULES & INSTRUCTIONS FOR AGENTS

### 4.1. Security & Environment Variables
- **CRITICAL:** NEVER use the `NEXT_PUBLIC_` prefix for sensitive environment variables like `DATABASE_URL`, `CLERK_SECRET_KEY`, or `GEMINI_API_KEY`. These must remain server-side only to prevent exposure to the client.
- Always document new environment variables in `.env.example`.

### 4.2. Handling Known Bugs & Tech Debt
Before implementing new features, be aware of (or help fix) the issues outlined in `_report.md`:
- **Schema Types:** `amount` fields in the DB schema are currently set as `varchar`. If making structural changes, note that they should ideally be `numeric`. Handle type casting carefully.
- **Data Joins:** `Incomes` and `Expenses` are separate entities. Do not attempt to join them using `budgetId`, as `Incomes` do not have a budget relation.
- **Imports:** Always ensure you have correctly imported Drizzle ORM operators (e.g., `eq`, `and`, `desc`, `sql`) before using them in database queries.

### 4.3. Code Quality Conventions
- **Component File Extensions:** Standardize on `.jsx` or `.tsx` for React components instead of plain `.js`.
- **Error Handling:** Do not leave `catch` blocks empty or with just `console.log`. Use the integrated `sonner` toast notifications to inform the user of API or DB operation failures.
- **State & Loading:** Ensure that data-fetching components have consistent loading states (skeletons) to avoid layout shifts and improve UX.
- **Validation:** Always validate inputs (avoiding negative amounts, special characters where inappropriate) before database insertions.

### 4.4. UI/UX Guidelines
- The user expects a "WOW" factor and premium design aesthetics.
- Use smooth micro-animations (e.g., Framer Motion) and interactive hover effects.
- Prefer curated, modern color palettes and typography over generic styles.

### 4.5. Planning Mode
- For complex requests (e.g., significant architecture refactoring, setting up pagination, schema migrations), pause and create an `implementation_plan.md` to get user approval before writing code.
