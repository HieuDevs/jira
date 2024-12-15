import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateInviteCode(length: number = 6) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
  return Array.from(
    { length },
    () => characters[Math.floor(Math.random() * characters.length)]
  ).join('');
}
