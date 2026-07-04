import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFCFA(amount: number) {
  return new Intl.NumberFormat("fr-CM", { style: "decimal" }).format(amount) + " FCFA";
}
