/**
 * Converts country name or code to Unicode flag emoji
 * Supports both full country names and ISO 2-letter country codes
 */

// Country names to flag emojis
const COUNTRY_FLAGS: Record<string, string> = {
  Afghanistan: "🇦🇫",
  Albania: "🇦🇱",
  Algeria: "🇩🇿",
  Andorra: "🇦🇩",
  Angola: "🇦🇴",
  Argentina: "🇦🇷",
  Armenia: "🇦🇲",
  Australia: "🇦🇺",
  Austria: "🇦🇹",
  Azerbaijan: "🇦🇿",
  Bahrain: "🇧🇭",
  Bangladesh: "🇧🇩",
  Belgium: "🇧🇪",
  Benin: "🇧🇯",
  Bolivia: "🇧🇴",
  Botswana: "🇧🇼",
  Brazil: "🇧🇷",
  Bulgaria: "🇧🇬",
  Cameroon: "🇨🇲",
  Canada: "🇨🇦",
  Chile: "🇨🇱",
  China: "🇨🇳",
  Colombia: "🇨🇴",
  Congo: "🇨🇬",
  Croatia: "🇭🇷",
  "Czech Republic": "🇨🇿",
  Denmark: "🇩🇰",
  Egypt: "🇪🇬",
  Ethiopia: "🇪🇹",
  Finland: "🇫🇮",
  France: "🇫🇷",
  Germany: "🇩🇪",
  Ghana: "🇬🇭",
  Greece: "🇬🇷",
  Hungary: "🇭🇺",
  India: "🇮🇳",
  Indonesia: "🇮🇩",
  Ireland: "🇮🇪",
  Israel: "🇮🇱",
  Italy: "🇮🇹",
  Japan: "🇯🇵",
  Kenya: "🇰🇪",
  Malaysia: "🇲🇾",
  Mexico: "🇲🇽",
  Morocco: "🇲🇦",
  Netherlands: "🇳🇱",
  "New Zealand": "🇳🇿",
  Nigeria: "🇳🇬",
  Norway: "🇳🇴",
  Pakistan: "🇵🇰",
  Philippines: "🇵🇭",
  Poland: "🇵🇱",
  Portugal: "🇵🇹",
  Qatar: "🇶🇦",
  Romania: "🇷🇴",
  Russia: "🇷🇺",
  "Saudi Arabia": "🇸🇦",
  Singapore: "🇸🇬",
  "South Africa": "🇿🇦",
  "South Korea": "🇰🇷",
  Spain: "🇪🇸",
  Sweden: "🇸🇪",
  Switzerland: "🇨🇭",
  Thailand: "🇹🇭",
  Turkey: "🇹🇷",
  Uganda: "🇺🇬",
  Ukraine: "🇺🇦",
  "United Arab Emirates": "🇦🇪",
  "United Kingdom": "🇬🇧",
  "United States": "🇺🇸",
  Vietnam: "🇻🇳",
  Zambia: "🇿🇲",
  Zimbabwe: "🇿🇼",
};

// ISO 2-letter country codes to flag emojis
const COUNTRY_CODES: Record<string, string> = {
  AF: "🇦🇫", // Afghanistan
  AL: "🇦🇱", // Albania
  DZ: "🇩🇿", // Algeria
  AD: "🇦🇩", // Andorra
  AO: "🇦🇴", // Angola
  AR: "🇦🇷", // Argentina
  AM: "🇦🇲", // Armenia
  AU: "🇦🇺", // Australia
  AT: "🇦🇹", // Austria
  AZ: "🇦🇿", // Azerbaijan
  BH: "🇧🇭", // Bahrain
  BD: "🇧🇩", // Bangladesh
  BE: "🇧🇪", // Belgium
  BJ: "🇧🇯", // Benin
  BO: "🇧🇴", // Bolivia
  BW: "🇧🇼", // Botswana
  BR: "🇧🇷", // Brazil
  BG: "🇧🇬", // Bulgaria
  CM: "🇨🇲", // Cameroon
  CA: "🇨🇦", // Canada
  CL: "🇨🇱", // Chile
  CN: "🇨🇳", // China
  CO: "🇨🇴", // Colombia
  CG: "🇨🇬", // Congo
  HR: "🇭🇷", // Croatia
  CZ: "🇨🇿", // Czech Republic
  DK: "🇩🇰", // Denmark
  EG: "🇪🇬", // Egypt
  ET: "🇪🇹", // Ethiopia
  FI: "🇫🇮", // Finland
  FR: "🇫🇷", // France
  DE: "🇩🇪", // Germany
  GH: "🇬🇭", // Ghana
  GR: "🇬🇷", // Greece
  HU: "🇭🇺", // Hungary
  IN: "🇮🇳", // India
  ID: "🇮🇩", // Indonesia
  IE: "🇮🇪", // Ireland
  IL: "🇮🇱", // Israel
  IT: "🇮🇹", // Italy
  JP: "🇯🇵", // Japan
  KE: "🇰🇪", // Kenya
  MY: "🇲🇾", // Malaysia
  MX: "🇲🇽", // Mexico
  MA: "🇲🇦", // Morocco
  NL: "🇳🇱", // Netherlands
  NZ: "🇳🇿", // New Zealand
  NG: "🇳🇬", // Nigeria
  NO: "🇳🇴", // Norway
  PK: "🇵🇰", // Pakistan
  PH: "🇵🇭", // Philippines
  PL: "🇵🇱", // Poland
  PT: "🇵🇹", // Portugal
  QA: "🇶🇦", // Qatar
  RO: "🇷🇴", // Romania
  RU: "🇷🇺", // Russia
  SA: "🇸🇦", // Saudi Arabia
  SG: "🇸🇬", // Singapore
  ZA: "🇿🇦", // South Africa
  KR: "🇰🇷", // South Korea
  ES: "🇪🇸", // Spain
  SE: "🇸🇪", // Sweden
  CH: "🇨🇭", // Switzerland
  TH: "🇹🇭", // Thailand
  TR: "🇹🇷", // Turkey
  UG: "🇺🇬", // Uganda
  UA: "🇺🇦", // Ukraine
  AE: "🇦🇪", // United Arab Emirates
  GB: "🇬🇧", // United Kingdom
  US: "🇺🇸", // United States
  VN: "🇻🇳", // Vietnam
  ZM: "🇿🇲", // Zambia
  ZW: "🇿🇼", // Zimbabwe
};

export function getCountryFlag(country: string | undefined): string {
  if (!country) return "";
  
  const trimmed = country.trim();
  
  // Try full country name first
  if (COUNTRY_FLAGS[trimmed]) {
    return COUNTRY_FLAGS[trimmed];
  }
  
  // Try uppercase country code
  const upperCode = trimmed.toUpperCase();
  if (COUNTRY_CODES[upperCode]) {
    return COUNTRY_CODES[upperCode];
  }
  
  // Try lowercase country code
  const lowerCode = trimmed.toLowerCase();
  if (COUNTRY_CODES[lowerCode.toUpperCase()]) {
    return COUNTRY_CODES[lowerCode.toUpperCase()];
  }
  
  // Fallback to globe emoji if not found
  return "🌍";
}
