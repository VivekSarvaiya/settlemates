import * as z from "zod/mini";
import { ROUTES } from "@/config/routes";
import {
  MAX_NAME_LENGTH,
  MAX_PARTICIPANTS,
  MIN_PARTICIPANTS,
  SPLIT_HASH_PARAM,
} from "./const";
import type { SharedPerson } from "./types";

// Zod Mini, because this check ships to the browser and full Zod is far heavier.
const sharedSplitSchema = z
  .array(
    z.tuple([
      z.string().check(z.maxLength(MAX_NAME_LENGTH)),
      z.int().check(z.nonnegative(), z.maximum(Number.MAX_SAFE_INTEGER)),
    ]),
  )
  .check(
    z.minLength(MIN_PARTICIPANTS),
    z.maxLength(MAX_PARTICIPANTS),
    z.refine((people) => {
      const total = people.reduce(
        (sum, [, paidCents]) => sum + BigInt(paidCents),
        BigInt(0),
      );
      return total > BigInt(0) && total <= BigInt(Number.MAX_SAFE_INTEGER);
    }),
  );

// The split travels in the URL fragment, which browsers never send to the server.
export function encodeSplit(people: SharedPerson[]): string {
  const json = JSON.stringify(
    people.map(({ name, paidCents }) => [name, paidCents]),
  );
  let binary = "";
  for (const byte of new TextEncoder().encode(json)) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeSplitHash(hash: string): SharedPerson[] | null {
  const encoded = new URLSearchParams(hash.replace(/^#/, "")).get(
    SPLIT_HASH_PARAM,
  );
  if (!encoded) return null;

  try {
    const binary = atob(encoded.replace(/-/g, "+").replace(/_/g, "/"));
    const json = new TextDecoder().decode(
      Uint8Array.from(binary, (char) => char.charCodeAt(0)),
    );
    const parsed = sharedSplitSchema.safeParse(JSON.parse(json));
    if (!parsed.success) return null;

    return parsed.data.map(([name, paidCents]) => ({ name, paidCents }));
  } catch {
    return null;
  }
}

export function buildSplitUrl(origin: string, people: SharedPerson[]): string {
  return `${origin}${ROUTES.splitBillCalculator}#${SPLIT_HASH_PARAM}=${encodeSplit(people)}`;
}
