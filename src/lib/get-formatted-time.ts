export function getFormattedTime(timeInMs: number) {
  const hours = Math.floor(timeInMs / 1000 / 60 / 60);
  const minutes = Math.floor((timeInMs / 1000 / 60) % 60);
  const seconds = Math.floor((timeInMs / 1000) % 60);

  return {
    hours,
    minutes,
    seconds,
    formattedHours: String(hours).padStart(2, "0"),
    formattedMinutes: String(minutes).padStart(2, "0"),
    formattedSeconds: String(seconds).padStart(2, "0"),
  };
}
