/**
 * Currency formatter - Bangladeshi Taka (tk)
 * locale: "en" → 1,250.50 tk | "bn" → ১,২৫০.৫০ tk
 */

export function formatCurrency(amount, locale = "en") {
  const loc = locale === "bn" ? "bn-BD" : "en-US";
  const formatted = Number(Math.round(amount)).toLocaleString(loc, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `${formatted} tk`;
}
