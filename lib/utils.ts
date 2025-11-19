import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
// @ts-ignore - psl types are not resolving correctly with current module config
import psl from "psl";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDomain(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    const parsed = psl.get(hostname);
    return parsed || hostname;
  } catch {
    return "";
  }
}
