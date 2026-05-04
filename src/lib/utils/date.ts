const TZ = "Asia/Bangkok";

export function formatThaiDate(date?: Date): string {
  return new Intl.DateTimeFormat("th-TH", {
    timeZone: TZ,
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date ?? new Date());
}

export function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { timeZone: TZ, month: "short", day: "numeric" });
}

export function getThaiGreeting(): string {
  const h = parseInt(
    new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", hour12: false }).format(new Date()),
    10,
  ) % 24;
  if (h < 12) return "อรุณสวัสดิ์";
  if (h < 17) return "สวัสดีตอนบ่าย";
  return "สวัสดีตอนเย็น";
}
