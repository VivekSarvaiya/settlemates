import { CONTACT_EMAIL } from "@/config/site";
import { MDX_LINK_CLASS } from "../const";

export function ContactEmail() {
  return (
    <a href={`mailto:${CONTACT_EMAIL}`} className={MDX_LINK_CLASS}>
      {CONTACT_EMAIL}
    </a>
  );
}
