import { render, screen, within } from "@testing-library/react";
import { Cookie } from "lucide-react";
import { describe, expect, it } from "vitest";
import { LegalHeading } from "@/components/mdx/LegalElements/LegalElements";
import { LegalPage } from "@/components/shared";

describe("LegalPage", () => {
  it("lays out a summary, highlights and contents that link to each section", () => {
    render(
      <LegalPage
        title="Privacy Policy"
        breadcrumb="Privacy"
        summary="What happens to your information."
        updatedAt="2026-11-18"
        highlights={[{ icon: Cookie, title: "No cookies", description: "None are set." }]}
        sections={[{ id: "1-the-calculator", text: "1. The calculator" }]}
      >
        <LegalHeading>1. The calculator</LegalHeading>
      </LegalPage>,
    );

    expect(screen.getByRole("heading", { level: 1, name: "Privacy Policy" })).toBeInTheDocument();
    expect(screen.getByText("18 Nov 2026")).toHaveAttribute("datetime", "2026-11-18");
    expect(screen.getByText("No cookies")).toBeInTheDocument();

    const contents = within(screen.getByRole("navigation", { name: "Contents" }));
    expect(contents.getByRole("link", { name: "1. The calculator" })).toHaveAttribute(
      "href",
      "#1-the-calculator",
    );
    expect(screen.getByRole("heading", { level: 2, name: "1. The calculator" })).toHaveAttribute(
      "id",
      "1-the-calculator",
    );
  });
});
