export interface ExampleShare {
  name: string;
  detail?: string;
  cents: number;
}

export interface SplitMethod {
  title: string;
  description: string;
  exampleCaption: string;
  exampleShares: ExampleShare[];
  note?: string;
}
