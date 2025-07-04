
import { LocalizedText, Language, Ingredient } from './types.ts';
import { SupportedLanguages } from './constants.ts';

// Localization Utility
export const getTranslatedText = (
  localizedText: LocalizedText | undefined,
  preferredLang: Language,
  fallbackLang: Language = Language.EN
): string => {
  if (!localizedText) return 'N/A';
  if (localizedText[preferredLang]) return localizedText[preferredLang]!;
  if (localizedText[fallbackLang]) return localizedText[fallbackLang]!;
  // Fallback to the first available language if preferred and fallback are not found
  for (const key in localizedText) {
    if (localizedText[key as Language]) return localizedText[key as Language]!;
  }
  return 'N/A'; // Or some other placeholder
};

export const getIngredientName = (
    ingredient: Ingredient | undefined,
    preferredLang: Language,
    fallbackLang: Language = Language.EN
): string => {
    if (!ingredient) return 'N/A';
    return getTranslatedText(ingredient.name_localized, preferredLang, fallbackLang);
};
