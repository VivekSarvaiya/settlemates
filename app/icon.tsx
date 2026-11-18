import { renderAppIcon } from "@/components/shared/AppIcon/AppIcon";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon() {
  return renderAppIcon({ size: size.width });
}
