// utils/getFinancialAdvice.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
  systemInstruction: `You are a personal finance advisor for an Indian user.
You give specific, actionable advice based on real numbers — never generic
platitudes like "spend wisely" or "save more".
Respond ONLY with plain text, no markdown, no JSON.`,
});

const getFinancialAdvice = async ({
  totalBudget,
  totalIncome,
  totalSpend,
  categories = [], 
}) => {
  try {
    const remaining = totalBudget - totalSpend;
    const utilizationPct = totalBudget ? ((totalSpend / totalBudget) * 100).toFixed(1) : 0;

    const categorySummary = categories
      .map(c => {
        const pct = c.budget ? ((c.spent / c.budget) * 100).toFixed(0) : 0;
        return `${c.name} (${pct}% spent)`;
      })
      .join(", ");

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysLeft = daysInMonth - today.getDate();
    const currentDateTimeStr = today.toLocaleString();

    const userPrompt = `
Today's Date & Time: ${currentDateTimeStr}

Monthly overview:
- Total Budget: ₹${totalBudget}
- Total Spend: ₹${totalSpend}
- Remaining: ₹${remaining}
- Budget utilization: ${utilizationPct}%
- Days remaining in month: ${daysLeft}

In 1-2 short sentences, tell the user whether their spending this month
looks healthy, risky, or needs attention — like a friend giving a quick
gut-check, not a report. Be specific about why (mention pace vs. days
left, or a category if something stands out from: ${categorySummary}).
Return plain text, no markdown, no JSON.
`;

    const result = await model.generateContent(userPrompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Error fetching financial advice:", error);
    return "Sorry, I couldn't fetch financial advice right now.";
  }
};

export default getFinancialAdvice;
