import type { ExamplePerson, HowToStep } from "./types";

export const HOW_TO_STEPS: HowToStep[] = [
  {
    title: "Add up what everyone paid",
    description: "That total is the whole bill, however it was paid.",
  },
  {
    title: "Divide by the number of people",
    description: "That's each person's fair share.",
  },
  {
    title: "Compare each payment with the share",
    description:
      "Paid more than the share? You get the difference back. Paid less? You owe it.",
  },
  {
    title: "Match who owes with who is owed",
    description:
      "Whoever owes the most pays whoever is owed the most, until everyone is at zero.",
  },
];

export const EXAMPLE_PEOPLE: ExamplePerson[] = [
  { name: "You", paidCents: 240_000 },
  { name: "Amit", paidCents: 60_000 },
  { name: "Priya", paidCents: 0 },
];
