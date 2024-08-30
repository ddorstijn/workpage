export function formatTimediff(diff: number | null) {
  if (diff === null) {
    return "-:--";
  }

  let seconds = Math.floor(diff / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  return `${String(hours).padStart(2, "0")}:${String(minutes % 60).padStart(
    2,
    "0"
  )}`;
}

export function formatDateTime(date: number | null) {
  if (date === null) {
    return "-:--";
  }

  return new Date(date).toLocaleTimeString("en-gb", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
