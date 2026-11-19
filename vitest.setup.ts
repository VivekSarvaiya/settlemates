import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// Motion's useInView / layout effects need these browser APIs, which jsdom omits.
class MockIntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly thresholds: number[] = [];

  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
vi.stubGlobal("ResizeObserver", MockResizeObserver);

// jsdom has no canvas; returning null takes the Hero background's "no 2D context" path quietly.
HTMLCanvasElement.prototype.getContext = () => null;

vi.stubGlobal(
  "matchMedia",
  vi.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
);
