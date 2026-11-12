import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/config/routes";
import { NAV_ITEMS } from "./const";

const SCROLL_THRESHOLD = 8;

const subscribeToScroll = (onStoreChange: () => void) => {
  window.addEventListener("scroll", onStoreChange, { passive: true });
  return () => window.removeEventListener("scroll", onStoreChange);
};

const getIsScrolled = () => window.scrollY > SCROLL_THRESHOLD;
const getServerIsScrolled = () => false;

export const useHeader = () => {
  const isScrolled = useSyncExternalStore(
    subscribeToScroll,
    getIsScrolled,
    getServerIsScrolled,
  );
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // The layout persists across routes, so re-observe whenever the page changes.
  useEffect(() => {
    const sections = NAV_ITEMS.flatMap((item) =>
      item.sectionId ? [document.getElementById(item.sectionId)] : [],
    ).filter((section): section is HTMLElement => section !== null);
    if (sections.length === 0) return;

    const visibleIds = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleIds.add(entry.target.id);
          else visibleIds.delete(entry.target.id);
        });
        const next = NAV_ITEMS.find(
          (item) => item.sectionId && visibleIds.has(item.sectionId),
        );
        setActiveSection(next?.sectionId ?? null);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [pathname]);

  const activeHref =
    pathname === ROUTES.home
      ? NAV_ITEMS.find((item) => item.sectionId === activeSection)?.href
      : pathname;

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const handleToggleOpen = () => setIsOpen((open) => !open);
  const handleNavigate = () => setIsOpen(false);

  return {
    isScrolled,
    isOpen,
    activeHref,
    navItems: NAV_ITEMS,
    handleToggleOpen,
    handleNavigate,
  };
};
