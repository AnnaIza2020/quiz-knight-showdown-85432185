
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Łączy klasy CSS z różnych źródeł, używając tailwind-merge
 * Zapobiega konfliktom i duplikacjom klas Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
