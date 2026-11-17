import { z } from "zod";
import { ROUTES } from "@/config/routes";
import {
  MAX_NAME_LENGTH,
  MAX_PARTICIPANTS,
  MIN_PARTICIPANTS,
  SPLIT_HASH_PARAM,
} from "./const";
import type { SharedPerson } from "./types";

const sharedSplitSchema = z
  .array(
    z.tuple([
      z.string().max(MAX_NAME_LENGTH),
      z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
    ]),
  )
  .min(MIN_PARTICIPANTS)
  .max(MAX_PARTICIPANTS)
  .refine((people) => {
    const total = people.reduce(
      (sum, [, paidCents]) => sum + BigInt(paidCents),
      BigInt(0),
    );
    return total > BigInt(0) && total <= BigInt(Number.MAX_SAFE_INTEGER);
  });

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
