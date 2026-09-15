import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * shadcn's class merger — lets generated components drop straight in, and lets
 * callers override our utility classes without specificity fights.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
