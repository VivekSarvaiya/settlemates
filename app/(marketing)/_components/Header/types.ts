export interface NavItem {
  label: string;
  href: string;
  sectionId?: string;
  isBlogLink?: boolean;
}

export interface HeaderProps {
  isBlogVisible: boolean;
}
