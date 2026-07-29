/** Normalize to local Uganda format expected by the backend (0XXXXXXXXX). */
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

const LOCAL_UGANDA_MOBILE_PATTERN = /^0(77|78|76|39|75|70|74|72|71|79)\d{7}$/;

export function isValidUgandaPhoneLocal(input: string): boolean {
  return LOCAL_UGANDA_MOBILE_PATTERN.test(normalizeUgandaPhoneLocal(input));
}
