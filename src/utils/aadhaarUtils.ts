/**
 * UIDAI standard Aadhaar masking utility
 * Masks the first 8 digits and exposes only the last 4 digits (e.g. XXXX XXXX 9821)
 */
export function maskAadhaarNumber(rawAadhaar?: string): string {
  if (!rawAadhaar) return '';
  const digits = rawAadhaar.replace(/[^0-9]/g, '');
  if (digits.length === 0) return '';
  
  if (digits.length >= 12) {
    const last4 = digits.slice(-4);
    return `XXXX XXXX ${last4}`;
  }
  
  if (digits.length > 4) {
    const last4 = digits.slice(-4);
    const maskedPrefix = 'X'.repeat(digits.length - 4);
    return `${maskedPrefix} ${last4}`;
  }
  
  return 'XXXX XXXX ' + digits;
}

/**
 * Format raw 12 digits into grouped string: "1234 5678 9012"
 */
export function formatAadhaarNumber(rawAadhaar?: string): string {
  if (!rawAadhaar) return '';
  const digits = rawAadhaar.replace(/[^0-9]/g, '').slice(0, 12);
  const parts = [];
  for (let i = 0; i < digits.length; i += 4) {
    parts.push(digits.slice(i, i + 4));
  }
  return parts.join(' ');
}
