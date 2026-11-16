import {
  MAX_PARTICIPANTS,
  MIN_PARTICIPANTS,
} from "@/components/shared/SplitCalculator/const";
import type { CalculatorFaqEntry } from "./types";

// Also feeds the FAQPage structured data, so visible answers and JSON-LD always match.
export const CALCULATOR_FAQS: CalculatorFaqEntry[] = [
  {
    question: "How does the split calculator work?",
    answer:
      "Enter what each person paid towards the bill. The calculator adds those contributions to get the total, splits it equally, and shows each person's share plus who pays whom so everyone ends up square.",
  },
  {
    question: "What if someone didn't pay anything?",
    answer:
      "Leave their payment blank or enter 0. They still get an equal share, so the calculator will show them paying their share to whoever covered more of the bill.",
  },
  {
    question: "Does it show who pays whom?",
    answer:
      "Yes, whenever someone owes someone. The settlement clears the balances with the fewest practical payments, such as \"You pay Amit ₹666.67\". If everyone is already square, it says so.",
  },
  {
    question: "What happens when the total doesn't divide evenly?",
    answer:
      "The extra paisa go to the first person in the list, so the shares always add up to the total exactly. The result names who covers the extra amount.",
  },
  {
    question: "How many people can split a bill?",
    answer: `Anywhere from ${MIN_PARTICIPANTS} to ${MAX_PARTICIPANTS} people per split. You can rename each person before copying the breakdown.`,
  },
  {
    question: "Do I need an account to use the calculator?",
    answer:
      "No. The calculator runs in your browser — no sign-up and no app to install.",
  },
  {
    question: "Is my split saved anywhere?",
    answer:
      "No. Nothing you enter is stored; the split only exists in your browser tab. Copy the breakdown before you close the page.",
  },
  {
    question: "Which currency does it use?",
    answer:
      "Indian rupees (₹). You can type amounts with or without commas, in either 1,234.50 or 1,23,456 format.",
  },
];
