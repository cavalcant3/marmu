function onlyDigits(value) {
  return String(value ?? "").replace(/\D/g, "");
}

function maskPhone(value) {
  const digits = onlyDigits(value).slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function maskDecimal(value, fractionDigits = 2) {
  const normalized = String(value ?? "").replace(".", ",").replace(/[^\d,]/g, "");
  const [integer = "", ...fractionParts] = normalized.split(",");
  const fraction = fractionParts.join("").slice(0, fractionDigits);
  return fractionParts.length ? `${integer},${fraction}` : integer;
}

function parseDecimal(value) {
  const raw = String(value ?? "").trim();
  const normalized = raw.includes(",")
    ? raw.replace(/\./g, "").replace(",", ".")
    : raw;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number.isFinite(Number(value)) ? Number(value) : 0).replace(/\u00a0/g, " ");
}

function maskCurrency(value) {
  return formatCurrency(Number(onlyDigits(value)) / 100);
}

function currencyToNumber(value) {
  return Number(onlyDigits(value)) / 100;
}

function formatDecimal(value, fractionDigits = 2) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(Number.isFinite(Number(value)) ? Number(value) : 0);
}

function maskDate(value) {
  const digits = onlyDigits(value).slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function maskTime(value) {
  const digits = onlyDigits(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

module.exports = {
  currencyToNumber,
  formatCurrency,
  formatDecimal,
  maskCurrency,
  maskDate,
  maskDecimal,
  maskPhone,
  maskTime,
  parseDecimal,
};
