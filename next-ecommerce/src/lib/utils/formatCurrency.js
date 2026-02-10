/**
 * Currency formatter - Bangladeshi Taka (tk)
 * locale: "en" → 1,250.50 tk | "bn" → ১,২৫০.৫০ tk
 */

export function formatCurrency(amount, locale = "en") {
  const loc = locale === "bn" ? "bn-BD" : "en-US";
  const formatted = Number(amount).toLocaleString(loc, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${formatted} tk`;
}
