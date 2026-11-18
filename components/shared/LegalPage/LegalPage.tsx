import { FileText } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ROUTES } from "@/config/routes";
import { formatPostDate } from "@/lib/blog/format";
import { Breadcrumb } from "../Breadcrumb/Breadcrumb";
import type { LegalPageProps } from "./types";

export function LegalPage({
  title,
  breadcrumb,
  summary,
  updatedAt,
  highlights,
  sections,
  children,
}: LegalPageProps) {
  return (
    <article>
      <header className="border-b border-border bg-muted/40">
        <Container className="flex flex-col gap-4 py-10 md:py-14">
          <Breadcrumb items={[{ label: "Home", href: ROUTES.home }, { label: breadcrumb }]} />
          <h1 className="text-display-md font-medium">{title}</h1>
          <p className="max-w-2xl text-lead text-muted-foreground">{summary}</p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText aria-hidden="true" className="size-4" />
            Last updated <time dateTime={updatedAt}>{formatPostDate(updatedAt)}</time>
          </p>
        </Container>
      </header>

      <Container className="flex flex-col gap-12 py-10 md:py-14">
        <section aria-labelledby="at-a-glance-heading" className="flex flex-col gap-4">
          <h2 id="at-a-glance-heading" className="text-sm font-medium text-muted-foreground">
            At a glance
          </h2>
          <ul className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            {highlights.map((highlight) => (
              <li
                key={highlight.title}
                className="flex flex-col gap-2 rounded border border-border p-4 md:gap-3 md:p-5"
              >
                <highlight.icon aria-hidden="true" className="size-5 text-primary-text" />
                <p className="text-base font-medium">{highlight.title}</p>
                <p className="text-sm text-muted-foreground">{highlight.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-4 lg:gap-12">
          <nav
            aria-label="Contents"
            className="flex flex-col gap-3 self-start rounded border border-border p-5 lg:sticky lg:top-24 lg:border-0 lg:p-0"
          >
            <p className="text-sm font-medium">Contents</p>
            <ol className="flex flex-col gap-2 text-sm">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="block rounded text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {section.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="flex max-w-2xl flex-col gap-4 lg:col-span-3">{children}</div>
        </div>
      </Container>
    </article>
  );
}
