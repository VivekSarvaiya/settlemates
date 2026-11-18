import { AuthorAvatar } from "@/components/blog";
import { Container } from "@/components/ui/container";
import { AUTHORS } from "@/content/authors";

export function Team() {
  return (
    <section aria-labelledby="team-heading" className="border-b border-border py-16 md:py-24">
      <Container className="flex flex-col gap-10 lg:grid lg:grid-cols-3 lg:gap-14">
        <div className="flex flex-col gap-3">
          <span className="text-sm text-primary-text">Who&apos;s behind it</span>
          <h2 id="team-heading" className="text-display-md font-medium">
            Built independently.
          </h2>
          <p className="text-lead text-muted-foreground">
            SettleMates is built and run by its founder, who also writes the guides on the blog.
          </p>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-2">
          {Object.values(AUTHORS).map((author) => (
            <article
              key={author.id}
              id={author.id}
              aria-label={author.name}
              className="flex scroll-mt-24 flex-col gap-5 rounded border border-border p-6 sm:flex-row md:p-8"
            >
              <AuthorAvatar author={author} size="lg" />
              <div className="flex flex-col gap-1">
                <p className="text-lg font-medium">{author.name}</p>
                <p className="text-sm text-muted-foreground">{author.role}</p>
                <p className="pt-3 text-base text-muted-foreground">{author.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
