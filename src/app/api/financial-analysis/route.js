import { NextResponse } from "next/server";
import getDeepFinancialAnalysis from "../../../../utils/getDeepFinancialAnalysis";

export async function POST(request) {
  try {
    const { totalBudget, totalIncome, totalSpend, categories } = await request.json();

    // Validate input
    if (
      totalBudget === undefined ||
      totalIncome === undefined ||
      totalSpend === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const advice = await getDeepFinancialAnalysis({ totalBudget, totalIncome, totalSpend, categories });

    return NextResponse.json({ advice });
  } catch (error) {
    console.error("Error in financial advice API:", error);
    return NextResponse.json(
      { error: "Failed to fetch financial advice" },
      { status: 500 }
    );
  }
}
