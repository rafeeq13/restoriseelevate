type ClassValue = string | number | boolean | null | undefined | ClassValue[];

export function cn(...classes: ClassValue[]): string {
  const out: string[] = [];
  for (const c of classes) {
    if (!c) continue;
    if (typeof c === "string") out.push(c);
    else if (Array.isArray(c)) out.push(cn(...c));
  }
  return out.join(" ");
}
