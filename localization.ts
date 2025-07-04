
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
    const preferredKey = `name_${preferredLang}` as keyof Ingredient;
    const fallbackKey = `name_${fallbackLang}` as keyof Ingredient;

    if (ingredient[preferredKey]) {
        const name = ingredient[preferredKey];
        if (typeof name === 'string' && name.trim()) return name;
    }
    
    if (ingredient[fallbackKey]) {
        const name = ingredient[fallbackKey];
        if (typeof name === 'string' && name.trim()) return name;
    }
    
    // Ultimate fallback to the first available name field
    for (const lang of SupportedLanguages) {
        const key = `name_${lang}` as keyof Ingredient;
        if (ingredient[key]) {
            const name = ingredient[key];
            if (typeof name === 'string' && name.trim()) return name;
        }
    }
    
    return 'N/A';
};
