import { renderAppIcon } from "@/components/shared/AppIcon/AppIcon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return renderAppIcon({ size: size.width, isFullBleed: true });
}
