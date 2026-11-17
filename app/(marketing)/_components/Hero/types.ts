export interface HeroHeadline {
  /** Stays stable while only the amount changes, so the sentence doesn't re-animate per keystroke. */
  key: string;
  before: string;
  amount: string | null;
  detail: string;
}
