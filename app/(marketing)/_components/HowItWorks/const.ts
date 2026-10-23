export interface Step {
  title: string;
  description: string;
}

export const STEPS: Step[] = [
  {
    title: "Enter the bill",
    description:
      "Type the total and how many people are splitting. No account, no app install.",
  },
  {
    title: "Set the shares",
    description:
      "Split equally, by percentage, or by exact amount. The calculator tells you the moment it adds up.",
  },
  {
    title: "Share the result",
    description:
      "Copy the breakdown and send it to the group, so everyone knows what they owe before anyone pays.",
  },
];
