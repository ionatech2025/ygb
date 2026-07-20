/** Normalize to local Uganda format expected by the backend (077XXXXXXXX). */
export function normalizeUgandaPhoneLocal(input: string): string {
  const raw = input.trim().replace(/[^+\d]/g, '');
  let digits = raw.startsWith('+') ? raw.slice(1) : raw;

  if (/^0\d{9}$/.test(digits)) {
    return digits;
  }
  if (/^256\d{9}$/.test(digits)) {
    return '0' + digits.slice(3);
  }
  if (/^7\d{8}$/.test(digits)) {
    return '0' + digits;
  }
  return input.trim();
}

export function isValidUgandaPhoneLocal(input: string): boolean {
  return /^(077|078|076|070|075)\d{7}$/.test(normalizeUgandaPhoneLocal(input));
}
