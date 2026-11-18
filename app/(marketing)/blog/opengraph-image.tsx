import { renderOgImage } from "@/components/shared/OgImage/OgImage";
import { BLOG_PAGE } from "./_lib/const";

export { OG_ARTICLE_ALT as alt, OG_IMAGE_SIZE as size } from "@/components/shared/OgImage/const";
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({ eyebrow: "SettleMates blog", title: BLOG_PAGE.heading });
}
