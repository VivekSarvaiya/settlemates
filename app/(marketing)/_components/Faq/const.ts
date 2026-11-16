export interface FaqEntry {
  question: string;
  answer: string;
}

export const FAQS: FaqEntry[] = [
  {
    question: "Do I need an account to split a bill?",
    answer:
      "No. Quick Split works from a plain link — create an account only if you want to keep a running balance for a trip, a flat, or a regular group.",
  },
  {
    question: "What happens when the split doesn't divide evenly?",
    answer:
      "The leftover is never hidden. The calculator gives the extra paisa to the first person in the list and names who covers the extra amount, so every share adds up to the total.",
  },
  {
    question: "Can I edit a split after I've shared it?",
    answer:
      "Yes. Reopen the split, change a name or a payment, and copy the updated breakdown — the balances follow automatically.",
  },
  {
    question: "Does it work for trips and shared rent, not just one-off bills?",
    answer:
      "Yes. A weekend away, a month of groceries, and a single dinner bill all use the same people and the same running balance, so nothing has to be re-entered.",
  },
  {
    question: "Which currency does it use?",
    answer:
      "Amounts are shown in ₹ (INR) for now. Other currencies aren't part of this first release.",
  },
];
