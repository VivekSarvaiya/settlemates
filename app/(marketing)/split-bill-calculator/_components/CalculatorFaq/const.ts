import {
  MAX_PARTICIPANTS,
  MIN_PARTICIPANTS,
} from "@/components/shared/SplitCalculator/const";
import type { CalculatorFaqEntry } from "./types";

// Also feeds the FAQPage structured data, so visible answers and JSON-LD always match.
export const CALCULATOR_FAQS: CalculatorFaqEntry[] = [
  {
    question: "How do I split a bill when people paid different amounts?",
    answer:
      "Add up what everyone paid to get the total, divide it by the number of people to get each share, then compare each person's payment with that share. Whoever paid more gets the difference back; whoever paid less owes it. Enter the payments above and the calculator does this for you.",
  },
  {
    question: "How do I work out who owes whom?",
    answer:
      "After each person's balance is known, the person who owes the most pays the person who is owed the most, and so on until everyone is at zero. The calculator lists those payments in plain words, such as \"Priya pays you ₹1,000\". A group never needs more payments than one fewer than the number of people.",
  },
  {
    question: "What if someone didn't pay anything?",
    answer:
      "Leave their amount blank or enter 0. They still owe an equal share, so the calculator shows them paying it to whoever covered more of the bill.",
  },
  {
    question: "What happens when the total doesn't divide evenly?",
    answer:
      "The extra paisa go to the first people in the list, so the shares always add up to the total exactly. The result says who covers the extra amount.",
  },
  {
    question: "Can I use it for a trip or a month of shared flat expenses?",
    answer:
      "Yes, as one split: add up what each person spent over the trip or the month and enter those totals. Trip groups and shared living, where you add expenses as they happen, are coming soon.",
  },
  {
    question: "Can I split a bill unequally, for example by what each person ordered?",
    answer:
      "Not yet. The calculator splits the total equally between everyone in the list, so only add the people who should share the bill.",
  },
  {
    question: "Can I pay through the calculator, for example by UPI?",
    answer:
      "No. The calculator tells you who pays whom and how much. Settle up with any UPI app, cash or bank transfer.",
  },
  {
    question: "How many people can split a bill?",
    answer: `Anywhere from ${MIN_PARTICIPANTS} to ${MAX_PARTICIPANTS} people per split. Tap any name to rename that person before you share the result.`,
  },
  {
    question: "Do I need an account, and is my split saved?",
    answer:
      "No account and no app. Your split isn't saved on our servers: the split lives in your browser tab, and when you copy or share it, the link carries the split inside it so whoever opens it sees the same numbers.",
  },
  {
    question: "Which currency does it use?",
    answer:
      "Indian rupees (₹). You can type amounts with or without commas, in either 1,234.50 or 1,23,456 format.",
  },
];
