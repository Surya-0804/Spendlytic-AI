// utils/getDeepFinancialAnalysis.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
  systemInstruction: `You are a personal finance advisor for an Indian user.
You give specific, actionable advice based on real numbers — never generic
platitudes like "spend wisely" or "save more". Always reference at least
one specific category or figure from the data you're given.
Respond ONLY with valid JSON, no markdown fences, no preamble.`,
  generationConfig: {
    responseMimeType: "application/json",
  }
});

const getDeepFinancialAnalysis = async ({
  totalBudget,
  totalIncome,
  totalSpend,
  categories = [], 
}) => {
  try {
    const remaining = totalBudget - totalSpend;
    const utilizationPct = totalBudget ? ((totalSpend / totalBudget) * 100).toFixed(1) : 0;

    const categoryBreakdown = categories
      .map(c => {
        const pct = c.budget ? ((c.spent / c.budget) * 100).toFixed(0) : 0;
        return `- ${c.name}: budget ₹${c.budget}, spent ₹${c.spent} (${pct}%)`;
      })
      .join("\n");

    const userPrompt = `
Monthly overview:
- Total Budget: ₹${totalBudget}
- Total Income: ₹${totalIncome}
- Total Spend so far: ₹${totalSpend}
- Remaining: ₹${remaining}
- Overall budget utilization: ${utilizationPct}%

Category breakdown:
${categoryBreakdown || "No category data available"}

Return JSON in this exact shape:
{
  "summary": "1-2 sentence overview of financial health this month",
  "observations": ["specific observation referencing real numbers/categories", "..."],
  "recommendations": ["specific, actionable recommendation", "..."]
}
Keep observations and recommendations to 2-3 items each.
`;

    const result = await model.generateContent(userPrompt);
    const raw = result.response.text().trim();
    const cleaned = raw.replace(/^```json\s*|```$/g, "");
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Error fetching financial advice:", error);
    return {
      summary: "Sorry, I couldn't fetch financial advice right now.",
      observations: [],
      recommendations: [],
    };
  }
};

export default getDeepFinancialAnalysis;
