import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export const NAVIGATE_FUNCTION: FunctionDeclaration = {
  name: "navigate_to_page",
  description: "Navigate the user to a different page in the application.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      page: {
        type: Type.STRING,
        description: "The ID of the page to navigate to. Options: home, trading, swp, etf, stock-average, brokerage, sip, savings, emi, retirement, compound, tax, inflation, crypto, cagr, fd-rd, debt, blog, goals, chat.",
      },
    },
    required: ["page"],
  },
};

export const CALCULATE_SIP_FUNCTION: FunctionDeclaration = {
  name: "calculate_sip",
  description: "Calculate SIP returns based on input parameters.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      monthlyInvestment: { type: Type.NUMBER, description: "Monthly investment amount" },
      tenure: { type: Type.NUMBER, description: "Number of years" },
      expectedRate: { type: Type.NUMBER, description: "Expected annual return rate in percentage" },
    },
    required: ["monthlyInvestment", "tenure", "expectedRate"],
  },
};

export async function chatWithAI(messages: any[], userMessage: string, onNavigate?: (page: string) => void) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [...messages, { role: "user", parts: [{ text: userMessage }] }],
      config: {
        systemInstruction: `You are Velocity AI, the premium intelligence layer of Velocity Vault. 
        Your mission is to guide users toward financial mastery with real-time data and precision tools.

        CAPABILITIES:
        1. REAL-TIME SEARCH: Use 'googleSearch' for ANY question about current market prices, news, inflation rates, or global financial trends.
        2. NAVIGATION: Use 'navigate_to_page' to help users find tools. 
           - 'home': Landing page / Overview
           - 'sip': SIP / Compound interest calculator
           - 'savings': Savings target planner
           - 'emi': Loan / EMI calculator
           - 'retirement': Retirement freedom planner
           - 'chat': Immersive AI terminal for deep research
        3. CALCULATIONS: Use 'calculate_sip' if the user provides numbers for a quick estimate.

        STYLE: Concise, professional, and slightly futuristic. Use bold text for key numbers. Use bullet points for lists.`,
        tools: [
          { googleSearch: {} },
          { functionDeclarations: [NAVIGATE_FUNCTION, CALCULATE_SIP_FUNCTION] }
        ],
        toolConfig: { includeServerSideToolInvocations: true }
      },
    });

    const functionCalls = response.functionCalls;
    if (functionCalls) {
      const call = functionCalls[0];
      if (call.name === "navigate_to_page" && onNavigate) {
        const args = call.args as { page: string };
        onNavigate(args.page);
        return {
          text: `Executing navigation protocol... Entering **${args.page.toUpperCase()}** module. How else can I assist your strategy?`,
          role: "assistant"
        };
      }
      if (call.name === "calculate_sip") {
        const { monthlyInvestment, tenure, expectedRate } = call.args as any;
        const i = (expectedRate / 100) / 12;
        const n = tenure * 12;
        const maturityValue = monthlyInvestment * (((Math.pow(1 + i, n)) - 1) / i) * (1 + i);
        const totalInvested = monthlyInvestment * n;
        const wealthGained = maturityValue - totalInvested;

        return {
          text: `Calculation synced. Based on a monthly investment of **₹${monthlyInvestment.toLocaleString()}** over **${tenure} years** at **${expectedRate}%**:
          
          - Total Invested: **₹${Math.round(totalInvested).toLocaleString()}**
          - Wealth Gained: **₹${Math.round(wealthGained).toLocaleString()}**
          - Projected Maturity: **₹${Math.round(maturityValue).toLocaleString()}**
          
          Shall I take you to the full SIP calculator for a deeper analysis?`,
          role: "assistant"
        };
      }
    }

    return {
      text: response.text || "Connection stable. I am ready for your next directive.",
      role: "assistant",
      groundingMetadata: (response as any).groundingMetadata
    };
  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
}
