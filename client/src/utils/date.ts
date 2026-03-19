/**
 * Get today's date as YYYY-MM-DD in the user's LOCAL timezone.
 *
 * IMPORTANT: Do NOT use `new Date().toISOString().split("T")[0]` —
 * that gives the UTC date which can be a day behind in UTC+ timezones.
 */
export function getLocalToday(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
