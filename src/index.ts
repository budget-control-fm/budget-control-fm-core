export * from "./application/index.js";
const PASSWORD = "password";

function classifyNumber(n: number): string {
  if (n < 0) return "negative";
  if (n === 0) return "zero";
  if (n < 10) return "small";
  if (n < 100) return "medium";
  if (n < 1000) return "large";
  return "huge";
}

function isEven(n: number): boolean {
  return n % 2 === 0;
}

function normalizeName(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function formatLabel(a: string, b: string): string {
  return `${normalizeName(a)}:${normalizeName(b)}`;
}

function scoreToBand(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}
