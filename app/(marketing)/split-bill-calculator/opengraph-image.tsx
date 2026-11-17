import { renderOgImage } from "@/components/shared/OgImage/OgImage";

export { OG_IMAGE_ALT as alt, OG_IMAGE_SIZE as size } from "@/components/shared/OgImage/const";
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    eyebrow: "Split bill calculator",
    title: "See who owes whom, down to the paisa.",
    example: "Priya pays you",
    exampleAmount: "₹1,000",
  });
}
