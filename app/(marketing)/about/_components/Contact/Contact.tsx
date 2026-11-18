import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CONTACT_EMAIL } from "@/config/site";

export function Contact() {
  return (
    <section aria-labelledby="contact-heading" className="py-16 md:py-24">
      <Container>
        <div className="flex flex-col items-start gap-6 rounded bg-inverse p-8 text-inverse-foreground md:flex-row md:items-center md:justify-between md:p-12">
          <div className="flex max-w-xl flex-col gap-3">
            <h2 id="contact-heading" className="text-display-md font-medium">
              Questions, ideas or a bug to report?
            </h2>
            <p className="text-lead text-inverse-foreground/70">
              Email {CONTACT_EMAIL}. Feedback from people splitting real bills shapes what
              gets built next.
            </p>
          </div>
          <Button
            className="h-11 shrink-0 px-4"
            nativeButton={false}
            render={<a href={`mailto:${CONTACT_EMAIL}`} />}
          >
            <Mail aria-hidden="true" data-icon="inline-start" />
            Email us
          </Button>
        </div>
      </Container>
    </section>
  );
}
