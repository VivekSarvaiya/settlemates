export interface FooterLink {
  label: string;
  href: string;
  isBlogLink?: boolean;
}

export interface FooterLinkGroup {
  label: string;
  links: FooterLink[];
}

export interface FooterProps {
  isBlogVisible: boolean;
}
