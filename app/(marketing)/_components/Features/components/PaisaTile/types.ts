export interface BillOption {
  cents: number;
  label: string;
  isSelected: boolean;
}

export interface ShareRow {
  name: string;
  amountLabel: string;
  hasExtra: boolean;
}
