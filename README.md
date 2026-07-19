# Spendlytic AI ![Spendlytic AI Logo](/public/chart-donut.svg)

Spendlytic AI is a modern, AI-powered personal finance tracker and analyzer. It goes beyond simple expense logging by offering a complete month-to-month tracking system, subscription management, and intelligent financial insights powered by Google's Gemini AI. Designed with an ultra-premium, dark-mode-first aesthetic, Spendlytic AI is built for those who want both power and beauty in their financial tools.

![Spendlytic AI Dashboard](/public/dashboard.png)

## Core Features

- **Monthly Cycles & Rollover:** Financial tracking is scoped month-to-month. Easily view past months and seamlessly "clone" your budgets and income streams into a new month with a single click. Choose what happens to your leftover money (rollover or savings!).
- **Income Streams:** Track multiple sources of income (salary, side hustles, dividends) categorized for each month.
- **Budgeting & Expenses:** Create strict budgets for specific categories (e.g., Groceries, Entertainment) and log expenses against them. Visual progress bars instantly show you how close you are to your limits.
- **Subscription Management:** Never forget a recurring payment. Track all your weekly, monthly, and yearly subscriptions in one place, complete with upcoming payment dates.
- **AI Financial Advisor:** Click the "AI Advice" button on your dashboard to send your current month's financial footprint (incomes, budgets, expenses) to Gemini AI, which instantly responds with personalized tips and warnings.
- **Dynamic True Dark Mode:** A sleek, fully integrated dark mode that respects your system preferences but defaults to a premium light theme. 
- **Global Currency Toggle:** Instantly switch the entire application between USD ($) and INR (₹).

## Technologies Used

- **Framework:** Next.js 14 (App Router)
- **Database:** Neon DB (Serverless Postgres)
- **ORM:** Drizzle ORM
- **Authentication:** Clerk (`@clerk/nextjs`)
- **Styling:** Tailwind CSS, ShadCN UI, Lucide React
- **Animations:** Framer Motion, Recharts for data visualization
- **AI Integration:** Google Generative AI (Gemini SDK)

## Screenshots

### Dashboard
The central hub for your monthly finances, featuring AI integration and high-level charts.
![Spendlytic AI Dashboard](/public/dashboard.png)

### Incomes & Budgets
Define your limits and track your earnings with clear, card-based UI.
![Spendlytic AI Incomes](/public/incomes.png)
![Spendlytic AI Budgets](/public/budgets.png)

### Expenses
Log individual expenses and see them immediately deduct from your allocated budgets.
![Spendlytic AI Expenses](/public/expenses.png)

## Getting Started

1. **Clone the repository.**
2. **Install dependencies:** `npm install`
3. **Set up Environment Variables:** Create a `.env.local` file and add your `DATABASE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, and `GEMINI_API_KEY`.
4. **Push the Database Schema:** `npm run db:push`
5. **Run the Development Server:** `npm run dev`

Visit `http://localhost:3000` to start tracking your finances with AI!
