export function directionColor(direction: string): string {
  const d = direction.toLowerCase();
  if (d.includes("up")) return "text-up";
  if (d.includes("down")) return "text-down";
  return "text-muted";
}

export function changeColor(value: number): string {
  if (value > 0) return "text-up";
  if (value < 0) return "text-down";
  return "text-muted";
}

export function changeBgColor(value: number): string {
  if (value > 0) return "bg-up-bg text-up";
  if (value < 0) return "bg-down-bg text-down";
  return "bg-chip text-muted";
}
