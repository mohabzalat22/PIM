import { faker } from "@faker-js/faker";
import { Prisma } from "@prisma/client";

export function createLocale(): Prisma.LocaleCreateInput {
  const locales = [
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
  ];

  const locale = faker.helpers.arrayElement(locales);
  return {
    value: locale.value,
    label: locale.label,
  };
}
