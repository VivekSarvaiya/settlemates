import type { MDXComponents } from "mdx/types";
import { Callout } from "./Callout/Callout";
import { ContactEmail } from "./ContactEmail/ContactEmail";
import { CtaCard } from "./CtaCard/CtaCard";
import { Disclaimer } from "./Disclaimer/Disclaimer";
import { Figure } from "./Figure/Figure";
import { MdxH2, MdxH3 } from "./Heading/Heading";
import { LegalHeading, LegalList, LegalParagraph } from "./LegalElements/LegalElements";
import {
  MdxBlockquote,
  MdxCode,
  MdxHorizontalRule,
  MdxImageGuard,
  MdxLink,
  MdxList,
  MdxListItem,
  MdxOrderedList,
  MdxParagraph,
  MdxPre,
  MdxStrong,
  MdxSubheading,
  MdxTable,
  MdxTableCell,
  MdxTableHeaderCell,
  MdxTitleGuard,
} from "./MdxElements/MdxElements";

export { CtaCard } from "./CtaCard/CtaCard";
export { Disclaimer } from "./Disclaimer/Disclaimer";

export const MDX_COMPONENTS: MDXComponents = {
  h1: MdxTitleGuard,
  h2: MdxH2,
  h3: MdxH3,
  h4: MdxSubheading,
  p: MdxParagraph,
  a: MdxLink,
  ul: MdxList,
  ol: MdxOrderedList,
  li: MdxListItem,
  blockquote: MdxBlockquote,
  strong: MdxStrong,
  code: MdxCode,
  pre: MdxPre,
  hr: MdxHorizontalRule,
  table: MdxTable,
  th: MdxTableHeaderCell,
  td: MdxTableCell,
  img: MdxImageGuard,
  Callout,
  ContactEmail,
  CtaCard,
  Disclaimer,
  Figure,
};

// Privacy and Terms read as documents, not articles: smaller type and numbered, ruled sections.
export const LEGAL_MDX_COMPONENTS: MDXComponents = {
  h2: LegalHeading,
  p: LegalParagraph,
  ul: LegalList,
};
