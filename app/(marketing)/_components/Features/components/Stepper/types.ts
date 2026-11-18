export interface StepperProps {
  label: string;
  value: number;
  min: number;
  max: number;
  decreaseLabel: string;
  increaseLabel: string;
  onDecrease: () => void;
  onIncrease: () => void;
}
