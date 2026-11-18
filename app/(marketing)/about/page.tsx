import type { Metadata } from "next";
import { ROUTES } from "@/config/routes";
import { getAllPosts } from "@/lib/blog/posts";
import { getPublishedPosts } from "@/lib/blog/select";
import { AboutHero, Contact, Principles, Roadmap, Team } from "./_components";

export const metadata: Metadata = {
  title: "About",
  description:
    "Who builds SettleMates, what it does today, what's coming next, and how to get in touch.",
  alternates: { canonical: ROUTES.about },
};

export default async function AboutPage() {
  const hasGuides = getPublishedPosts(await getAllPosts()).length > 0;

  return (
    <>
      <AboutHero hasGuides={hasGuides} />
      <Principles />
      <Roadmap />
      <Team />
      <Contact />
    </>
  );
}
