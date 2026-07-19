import { NextResponse } from "next/server";
import getFinancialAdvice from "../../../../utils/getFinancialAdvice";

export async function POST(request) {
  try {
    const { totalBudget, totalIncome, totalSpend } = await request.json();

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

    const advice = await getFinancialAdvice(totalBudget, totalIncome, totalSpend);

    return NextResponse.json({ advice });
  } catch (error) {
    console.error("Error in financial advice API:", error);
    return NextResponse.json(
      { error: "Failed to fetch financial advice" },
      { status: 500 }
    );
  }
}
