export const calloutCategories = ["Rescue", "Search", "Incident"] as const;
export const journalCategories = [
  "Training",
  "Community",
  "Team News",
  "Fundraising",
] as const;
export const categories = [...calloutCategories, ...journalCategories] as const;
export const postDate = (date: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
export const mediaUrl = (path: string) => `/media/${encodeURIComponent(path)}`;
export const readingMinutes = (body: string) =>
  Math.max(1, Math.ceil(body.trim().split(/\s+/).length / 200));
export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100)
    .replace(/-$/, "");
