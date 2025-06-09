export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// utils/dateUtils.ts
export const getDaysLeft = (expiry: string | Date) => {
  const now = new Date();
  const exp = new Date(expiry);
  const diff = Math.max(0, Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  return diff;
};