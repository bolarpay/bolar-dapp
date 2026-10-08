export function whatsappSupportUrl(value: string | undefined): string | null {
  if (!value || !/^\+?[\d\s()-]+$/.test(value)) return null;
  const number = value.replace(/\D/g, "");
  if (!/^[1-9]\d{7,14}$/.test(number)) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent("Hola BOLAR, necesito ayuda con mi envío.")}`;
}
