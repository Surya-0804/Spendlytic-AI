// utils/getFinancialAdvice.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Create a new instance of the GoogleGenerativeAI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to generate personalized financial advice
const getFinancialAdvice = async (totalBudget, totalIncome, totalSpend) => {
  // console.log(totalBudget, totalIncome, totalSpend);
  try {
    const userPrompt = `
      Based on the following financial data:
      - Total Budget: ₹${totalBudget} 
      - Expenses: ₹${totalSpend} 
      - Incomes: ₹${totalIncome}
      Provide detailed financial advice in 2 sentences to help the user manage their finances more effectively.
    `;

    // Send the prompt to the Gemini API
    const result = await model.generateContent(userPrompt);

    // Process and return the response
    const advice = result.response.text(); // Call the text() method

    // console.log(advice);
    return advice;
  } catch (error) {
    console.error("Error fetching financial advice:", error);
    return "Sorry, I couldn't fetch the financial advice at this moment. Please try again later.";
  }
};

// Export the function
export default getFinancialAdvice;
