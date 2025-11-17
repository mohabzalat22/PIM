import { faker } from "@faker-js/faker";
import { Prisma } from "@prisma/client";

const availableLocales = [
  { value: "en_US", label: "English (US)" },
  { value: "en_GB", label: "English (UK)" },
  { value: "es_ES", label: "Spanish (Spain)" },
  { value: "fr_FR", label: "French (France)" },
  { value: "de_DE", label: "German (Germany)" },
  { value: "it_IT", label: "Italian (Italy)" },
  { value: "pt_BR", label: "Portuguese (Brazil)" },
  { value: "ja_JP", label: "Japanese (Japan)" },
  { value: "ko_KR", label: "Korean (Korea)" },
  { value: "zh_CN", label: "Chinese (China)" },
  { value: "ar_EG", label: "Arabic (Egypt)" },
  { value: "ru_RU", label: "Russian (Russia)" },
  { value: "nl_NL", label: "Dutch (Netherlands)" },
  { value: "sv_SE", label: "Swedish (Sweden)" },
  { value: "pl_PL", label: "Polish (Poland)" },
];

let localeIndex = 0;

export function createLocale(
  value?: string,
  label?: string
): Prisma.LocaleCreateInput {
  if (value && label) {
    return { value, label };
  }

  // If we've exhausted the predefined locales, generate unique ones
  if (localeIndex >= availableLocales.length) {
    const uniqueValue = `locale_${faker.string.alphanumeric(6)}_${localeIndex}`;
    const uniqueLabel = `${faker.location.country()} (${faker.location.state()})`;
    localeIndex++;
    return {
      value: uniqueValue,
      label: uniqueLabel,
    };
  }

  // Use sequential selection to avoid duplicates
  const locale = availableLocales[localeIndex];
  localeIndex++;

  return {
    value: locale!.value,
    label: locale!.label,
  };
}

export function resetLocaleIndex() {
  localeIndex = 0;
}
