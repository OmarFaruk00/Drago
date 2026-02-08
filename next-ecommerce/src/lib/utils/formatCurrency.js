/**
 * Currency formatter - Bangladeshi Taka (৳)
 * Formats price in Bangla style: ৳১,২৫০.৫০
 */

export function formatCurrency(amount) {
  const formatted = Number(amount).toLocaleString("bn-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `৳${formatted}`;
}
