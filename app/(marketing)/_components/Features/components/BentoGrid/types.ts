export interface BentoGridProps {
  siteOrigin: string;
}

export interface UseBentoGridParams {
  siteOrigin: string;
}

export interface DemoPerson {
  name: string;
  paidCents: number;
  balanceCents: number;
}

export interface DemoPayment {
  key: string;
  fromIndex: number;
  toIndex: number;
  amountCents: number;
  label: string;
}

export interface DemoGroup {
  people: DemoPerson[];
  totalCents: number;
  shareCents: number;
  payments: DemoPayment[];
}
