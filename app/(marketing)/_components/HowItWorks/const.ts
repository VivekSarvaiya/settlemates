export interface Step {
  title: string;
  description: string;
}

export const STEPS: Step[] = [
  {
    title: "Add the people",
    description:
      "Add everyone who shared the bill. No account, no app install.",
  },
  {
    title: "Enter what each person paid",
    description:
      "Type each person's contribution. The total and every equal share update as you type.",
  },
  {
    title: "Share the result",
    description:
      "Copy the shares and the who-pays-whom settlement, so everyone knows what to pay before anyone does.",
  },
];
