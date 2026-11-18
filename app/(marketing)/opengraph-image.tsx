import { renderOgImage } from "@/components/shared/OgImage/OgImage";

export { OG_IMAGE_ALT as alt, OG_IMAGE_SIZE as size } from "@/components/shared/OgImage/const";
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    eyebrow: "Split a bill in seconds",
    title: "Split expenses, not friendships.",
    example: { label: "Kabir pays you", amount: "₹800" },
  });
}
