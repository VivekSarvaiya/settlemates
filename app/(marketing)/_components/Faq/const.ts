export interface FaqEntry {
  question: string;
  answer: string;
}

export const FAQS: FaqEntry[] = [
  {
    question: "Do I need an account to split a bill?",
    answer:
      "No. There's nothing to sign up for and no app to install. Open the page and start typing.",
  },
  {
    question: "Is anything I type saved?",
    answer:
      "Not by us. The split lives in your browser tab. When you copy or share it, the link carries the split inside it, so it never reaches our servers.",
  },
  {
    question: "Can I change a split after I've shared it?",
    answer:
      "Yes. Open the link, tap Edit, change a name or a payment, and share the new link. The old link keeps the old numbers.",
  },
  {
    question: "What happens when the split doesn't divide evenly?",
    answer:
      "The leftover is never hidden. The extra paisa go to the first person in the list and the result names them, so every share adds up to the total.",
  },
  {
    question: "Does it work for trips and shared rent?",
    answer:
      "Not yet. Today SettleMates splits one bill at a time. Trip groups and shared living, with running balances and monthly reports, are coming soon.",
  },
  {
    question: "Which currency does it use?",
    answer:
      "Amounts are in ₹ (INR) for now. Other currencies aren't part of this first release.",
  },
];
