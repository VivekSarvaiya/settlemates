import { SITE_LANGUAGE } from "@/config/site";

const postDateFormatter = new Intl.DateTimeFormat(SITE_LANGUAGE, {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export const formatPostDate = (isoDate: string) =>
  postDateFormatter.format(new Date(`${isoDate}T00:00:00Z`));

export const formatReadingTime = (minutes: number) => `${minutes} min read`;
