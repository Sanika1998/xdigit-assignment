/** Regional indicator flag emoji from ISO 3166-1 alpha-2 (e.g. "ae" -> 🇦🇪). */
export function countryFlagEmoji(iso2: string): string {
  const code = iso2.trim().toUpperCase()
  if (!/^[A-Z]{2}$/.test(code)) return ''

  // Map each letter to its regional-indicator symbol (offset from 'A' = 0x1F1E6).
  return [...code]
    .map((char) => String.fromCodePoint(0x1f1e6 - 65 + char.charCodeAt(0)))
    .join('')
}
