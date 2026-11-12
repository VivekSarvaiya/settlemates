import {
  MAX_PARTICIPANTS,
  MIN_PARTICIPANTS,
} from "@/components/shared/SplitCalculator/const";
import type { CalculatorFaqEntry } from "./types";

// Also feeds the FAQPage structured data, so visible answers and JSON-LD always match.
export const CALCULATOR_FAQS: CalculatorFaqEntry[] = [
  {
    question: "How do I split a bill equally?",
    answer:
      "Enter the total, set the number of people, and tap Split it. Each share is shown in rupees. If the amount doesn't divide evenly, the extra paisa go to the first people in the list, so the shares always add up to the bill.",
  },
  {
    question: "How do I split a bill unequally?",
    answer:
      "After the equal split, choose Customise split and pick Percentage or Amount. Enter each person's share — the calculator shows how much is still to assign and only applies the split once it matches the total exactly.",
  },
  {
    question: "Can I split a bill by percentage?",
    answer:
      "Yes. Choose Percentage and give each person a share of 100%. Amounts are worked out to the paisa, and any rounding difference is assigned to someone so nothing goes missing.",
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
