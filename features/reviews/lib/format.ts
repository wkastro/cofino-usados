export function formatReviewDate(value: Date): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const day = date.getDate();
  const month = date.toLocaleString("es-GT", { month: "long" });
  const year = date.getFullYear();
  const monthLabel = month.charAt(0).toUpperCase() + month.slice(1);

  return `${day} ${monthLabel} ${year}`;
}

export function buildInitials(fullName: string): string {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
