const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

export function formatCurrencyBRL(value: number) {
  return currencyFormatter.format(value);
}
