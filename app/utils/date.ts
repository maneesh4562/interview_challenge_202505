const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

const RELATIVE_FORMATTER = new Intl.RelativeTimeFormat("en-US", {
  numeric: "auto",
});

/**
 * Format a date to a readable string (e.g., "Jan 15, 2024, 3:30 PM")
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return DATE_FORMATTER.format(dateObj);
}

/**
 * Format a date to a relative string (e.g., "2 days ago", "just now")
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  
  // Ensure both dates are in the same timezone
  const utcDate = new Date(dateObj.getTime() + dateObj.getTimezoneOffset() * 60000);
  const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  
  const diffInSeconds = Math.floor((utcDate.getTime() - utcNow.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // For very recent notes (less than 1 minute)
  if (Math.abs(diffInSeconds) < 60) {
    return "just now";
  }

  // For notes from today
  if (Math.abs(diffInDays) === 0) {
    if (Math.abs(diffInHours) > 0) {
      return RELATIVE_FORMATTER.format(diffInHours, "hour");
    }
    return RELATIVE_FORMATTER.format(diffInMinutes, "minute");
  }

  // For notes from yesterday
  if (Math.abs(diffInDays) === 1) {
    return "yesterday";
  }

  // For notes within the last month
  if (Math.abs(diffInDays) <= 30) {
    return RELATIVE_FORMATTER.format(diffInDays, "day");
  }

  // For older notes
  return formatDate(dateObj);
}
