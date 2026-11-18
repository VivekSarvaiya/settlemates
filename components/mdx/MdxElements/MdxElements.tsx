import Link from "next/link";
import { MDX_LINK_CLASS } from "../const";
import type {
  MdxBlockquoteProps,
  MdxCodeProps,
  MdxHeadingProps,
  MdxLinkProps,
  MdxListItemProps,
  MdxListProps,
  MdxOrderedListProps,
  MdxParagraphProps,
  MdxPreProps,
  MdxStrongProps,
  MdxTableCellProps,
  MdxTableHeaderCellProps,
  MdxTableProps,
} from "./types";

export function MdxParagraph({ children }: MdxParagraphProps) {
  return <p className="text-lead">{children}</p>;
}

export function MdxLink({ href = "", title, children }: MdxLinkProps) {
  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link href={href} title={title} className={MDX_LINK_CLASS}>
        {children}
      </Link>
    );
  }
  if (href.startsWith("mailto:")) {
    return (
      <a href={href} title={title} className={MDX_LINK_CLASS}>
        {children}
      </a>
    );
  }
  return (
    <a
      href={href}
      title={title}
      target="_blank"
      rel="noopener noreferrer"
      className={MDX_LINK_CLASS}
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export function MdxList({ children }: MdxListProps) {
  return (
    <ul className="flex list-disc flex-col gap-2 pl-6 text-lead marker:text-muted-foreground">
      {children}
    </ul>
  );
}

export function MdxOrderedList({ children, start }: MdxOrderedListProps) {
  return (
    <ol
      start={start}
      className="flex list-decimal flex-col gap-2 pl-6 text-lead marker:text-muted-foreground"
    >
      {children}
    </ol>
  );
}

export function MdxListItem({ children }: MdxListItemProps) {
  return <li className="pl-1">{children}</li>;
}

export function MdxBlockquote({ children }: MdxBlockquoteProps) {
  return (
    <blockquote className="flex flex-col gap-4 border-l-2 border-border pl-5 text-muted-foreground">
      {children}
    </blockquote>
  );
}

export function MdxStrong({ children }: MdxStrongProps) {
  return <strong className="font-medium">{children}</strong>;
}

export function MdxCode({ children }: MdxCodeProps) {
  return <code className="rounded-sm bg-muted px-1.5 py-0.5 text-base">{children}</code>;
}

export function MdxPre({ children }: MdxPreProps) {
  return (
    <pre className="overflow-x-auto rounded border border-border bg-muted/40 p-4 text-sm">
      {children}
    </pre>
  );
}

export function MdxHorizontalRule() {
  return <hr className="border-border" />;
}

export function MdxTable({ children }: MdxTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-base tabular-nums">
        {children}
      </table>
    </div>
  );
}

// GFM column alignment arrives as an inline text-align style, so it's passed through.
export function MdxTableHeaderCell({ children, style }: MdxTableHeaderCellProps) {
  return (
    <th
      style={style}
      className="border-b border-border py-3 pr-4 font-medium last:pr-0"
    >
      {children}
    </th>
  );
}

export function MdxTableCell({ children, style }: MdxTableCellProps) {
  return (
    <td style={style} className="border-b border-border py-3 pr-4 align-top last:pr-0">
      {children}
    </td>
  );
}

export function MdxSubheading({ children }: MdxHeadingProps) {
  return <h4 className="text-base font-medium">{children}</h4>;
}

// The page renders the post title as the only h1, so a "#" heading in a post is a mistake.
export function MdxTitleGuard(): never {
  throw new Error('Posts can\'t use "#" headings: the title comes from meta.title. Start sections with "##".');
}

export function MdxImageGuard(): never {
  throw new Error(
    'Markdown images aren\'t supported. Import the file and use <Figure src={image} alt="…" /> so its size is known.',
  );
}
