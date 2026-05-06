export function sanitizeText(value) {
  if (typeof value !== "string") {
    return value;
  }

  return value.replace(/[<>]/g, "").replace(/\s+/g, " ").trim();
}

export function sanitizeObject(input) {
  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => [
      key,
      typeof value === "string" ? sanitizeText(value) : value,
    ]),
  );
}
