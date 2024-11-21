import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Conversion functions
export function inchesToCm(inches: number): number {
  return inches * 2.54;
}

export function cmToInches(cm: number): number {
  return cm / 2.54;
}

export function lbsToKg(lbs: number): number {
  return lbs * 0.453592;
}

export function kgToLbs(kg: number): number {
  return kg * 2.20462;
}

export function formatNumber(num: number): string {
  return num.toFixed(2);
}

interface Dimensions {
  length: number;
  width: number;
  height: number;
}

export function convertDimensions(dims: Dimensions, from: "imperial" | "metric"): Dimensions {
  const converter = from === "imperial" ? inchesToCm : cmToInches;
  return {
    length: converter(dims.length),
    width: converter(dims.width),
    height: converter(dims.height),
  };
}

export function calculateCBM(dims: Dimensions): number {
  // Convert to CM if dimensions are in inches
  const cmDims = {
    length: dims.length * 2.54,
    width: dims.width * 2.54,
    height: dims.height * 2.54,
  };
  return (cmDims.length * cmDims.width * cmDims.height) / 1000000;
}

export function calculateCFT(dims: Dimensions): number {
  return (dims.length * dims.width * dims.height) / 1728;
}

export function formatDimensions(dims: Dimensions, unit: string): string {
  return `${formatNumber(dims.length)}×${formatNumber(dims.width)}×${formatNumber(dims.height)} ${unit}`;
}

export function formatWeight(weight: number, primaryUnit: string, convertedWeight: number, secondaryUnit: string): string {
  return `${formatNumber(weight)} ${primaryUnit}\n${formatNumber(convertedWeight)} ${secondaryUnit}`;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  // ... rest of the currencies remain the same
];

export function formatPrice(amount: number, currency: Currency): string {
  return `${currency.symbol}${amount.toFixed(2)}`;
}