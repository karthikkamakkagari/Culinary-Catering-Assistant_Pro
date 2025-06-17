import { Language, LocalizedText, UITranslationKeys } from './types';

export const uiTranslations: { [key in UITranslationKeys]: LocalizedText } = {
  // General
  [UITranslationKeys.ADD_NEW]: { 
    [Language.EN]: 'Add New', 
    [Language.TE]: 'కొత్తది జోడించు', 
    [Language.TA]: 'புதியதைச் சேர்',
    [Language.KN]: 'ಹೊಸದನ್ನು ಸೇರಿಸಿ',
    [Language.HI]: 'नया जोड़ें'
  },
  [UITranslationKeys.SAVE_CHANGES]: {
    [Language.EN]: 'Save Changes',
    [Language.TE]: 'మార్పులను పదిలపరచుము',
    [Language.TA]: 'மாற்றங்களை சேமிக்கவும்',
    [Language.KN]: 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ',
    [Language.HI]: 'परिवर्तन सहेजें'
  },
  [UITranslationKeys.CANCEL]: {
    [Language.EN]: 'Cancel',
    [Language.TE]: 'రద్దు చేయండి',
    [Language.TA]: 'ரத்துசெய்',
    [Language.KN]: 'ರದ್ದುಗೊಳಿಸಿ',
    [Language.HI]: 'रद्द करें'
  },
  [UITranslationKeys.SEARCH_PLACEHOLDER]: {
    [Language.EN]: 'Search...',
    [Language.TE]: 'వెతకండి...',
    [Language.TA]: 'தேடு...',
    [Language.KN]: 'ಹುಡುಕಿ...',
    [Language.HI]: 'खोजें...'
  },
  [UITranslationKeys.NAME_LABEL]: {
    [Language.EN]: 'Name',
    [Language.TE]: 'పేరు',
    [Language.TA]: 'பெயர்',
    [Language.KN]: 'ಹೆಸರು',
    [Language.HI]: 'नाम'
  },
  [UITranslationKeys.IMAGE_LABEL]: {
    [Language.EN]: 'Image',
    [Language.TE]: 'చిత్రం',
    [Language.TA]: 'படம்',
    [Language.KN]: 'ಚಿತ್ರ',
    [Language.HI]: 'छवि'
  },
  // Ingredients
  [UITranslationKeys.INGREDIENTS_PAGE_TITLE]: { 
    [Language.EN]: 'Ingredients', 
    [Language.TE]: 'పదార్థాలు',
    [Language.TA]: 'பொருட்கள்',
    [Language.KN]: 'ಪದಾರ್ಥಗಳು',
    [Language.HI]: 'सामग्री'
  },
  [UITranslationKeys.ADD_INGREDIENT_TITLE]: {
    [Language.EN]: 'Add Ingredient',
    [Language.TE]: 'పదార్ధాన్ని జోడించండి',
    [Language.TA]: 'பொருளைச் சேர்',
    [Language.KN]: 'ಪದಾರ್ಥವನ್ನು ಸೇರಿಸಿ',
    [Language.HI]: 'सामग्री जोड़ें'
  },
  [UITranslationKeys.EDIT_INGREDIENT_TITLE]: {
    [Language.EN]: 'Edit Ingredient',
    [Language.TE]: 'పదార్ధాన్ని సవరించండి',
    [Language.TA]: 'பொருளைத் திருத்து',
    [Language.KN]: 'ಪದಾರ್ಥವನ್ನು ಸಂಪಾದಿಸಿ',
    [Language.HI]: 'सामग्री संपादित करें'
  },
  [UITranslationKeys.INGREDIENT_NAME_LABEL]: { 
    [Language.EN]: 'Ingredient Name',
    [Language.TE]: 'పదార్ధం పేరు',
    [Language.TA]: 'பொருள் பெயர்',
    [Language.KN]: 'ಪದಾರ್ಥದ ಹೆಸರು',
    [Language.HI]: 'सामग्री का नाम'
  },
  [UITranslationKeys.QUANTITY_LABEL]: {
    [Language.EN]: 'Quantity',
    [Language.TE]: 'పరిమాణం',
    [Language.TA]: 'அளவு',
    [Language.KN]: 'ಪ್ರಮಾಣ',
    [Language.HI]: 'मात्रा'
  },
  [UITranslationKeys.UNIT_LABEL]: {
    [Language.EN]: 'Unit',
    [Language.TE]: 'యూనిట్',
    [Language.TA]: 'அலகு',
    [Language.KN]: 'ಘಟಕ',
    [Language.HI]: 'इकाई'
  },
  // Cooking Items
  [UITranslationKeys.COOKING_ITEMS_PAGE_TITLE]: {
    [Language.EN]: 'Cooking Items',
    [Language.TE]: 'వంట సామాగ్రి',
    [Language.TA]: 'சமையல் பொருட்கள்',
    [Language.KN]: 'ಅಡುಗೆ ಸಾಮಗ್ರಿಗಳು',
    [Language.HI]: 'खाना पकाने की सामग्री'
  },
  [UITranslationKeys.ADD_COOKING_ITEM_TITLE]: {
    [Language.EN]: 'Add Cooking Item',
    [Language.TE]: 'వంట సామాగ్రిని జోడించండి',
    [Language.TA]: 'சமையல் பொருளைச் சேர்',
    [Language.KN]: 'ಅಡುಗೆ ಸಾಮಾನುಗಳನ್ನು ಸೇರಿಸಿ',
    [Language.HI]: 'खाना पकाने की सामग्री जोड़ें'
  },
  [UITranslationKeys.EDIT_COOKING_ITEM_TITLE]: {
    [Language.EN]: 'Edit Cooking Item',
    [Language.TE]: 'వంట సామాగ్రిని సవరించండి',
    [Language.TA]: 'சமையல் பொருளைத் திருத்து',
    [Language.KN]: 'ಅಡುಗೆ ಸಾಮಾನುಗಳನ್ನು ಸಂಪಾದಿಸಿ',
    [Language.HI]: 'खाना पकाने की सामग्री संपादित करें'
  },
  [UITranslationKeys.COOKING_ITEM_NAME_LABEL]: { 
    [Language.EN]: 'Item Name',
    [Language.TE]: 'వస్తువు పేరు',
    [Language.TA]: 'பொருள் பெயர்',
    [Language.KN]: 'ಐಟಂ ಹೆಸರು',
    [Language.HI]: 'वस्तु का नाम'
  },
  [UITranslationKeys.SUMMARY_LABEL]: {
    [Language.EN]: 'Summary',
    [Language.TE]: 'సారాంశం',
    [Language.TA]: 'சுருக்கம்',
    [Language.KN]: 'ಸಾರಾಂಶ',
    [Language.HI]: 'सारांश'
  },
  // PDF Labels
  [UITranslationKeys.PDF_ORDER_SUMMARY_TITLE]: { en: 'Order Summary', te: 'ఆర్డర్ సారాంశం', ta: 'ஆர்டர் சுருக்கம்', kn: 'ಆರ್ಡರ್ ಸಾರಾಂಶ', hi: 'आदेश सारांश' },
  [UITranslationKeys.PDF_GENERATED_ON_LABEL]: { en: 'Generated:', te: 'న ఉత్పత్తి చేయబడింది:', ta: 'உருவாக்கப்பட்டது:', kn: 'ರಚಿಸಲಾಗಿದೆ:', hi: 'उत्पन्न:' },
  [UITranslationKeys.PDF_CUSTOMER_LABEL]: { en: 'Customer:', te: 'కస్టమర్:', ta: 'வாடிக்கையாளர்:', kn: 'ಗ್ರಾಹಕರು:', hi: 'ग्राहक:' },
  [UITranslationKeys.PDF_CUSTOMER_PHONE_LABEL]: { en: 'Phone:', te: 'ఫోన్:', ta: 'தொலைபேசி:', kn: 'ದೂರವಾಣಿ:', hi: 'फ़ोन:' },
  [UITranslationKeys.PDF_CUSTOMER_ADDRESS_LABEL]: { en: 'Address:', te: 'చిరునామా:', ta: 'முகவரி:', kn: 'ವಿಳಾಸ:', hi: 'पता:' },
  [UITranslationKeys.PDF_NUM_PERSONS_LABEL]: { en: 'Number of Persons:', te: 'వ్యక్తుల సంఖ్య:', ta: 'நபர்களின் எண்ணிக்கை:', kn: 'ವ್ಯಕ್ತಿಗಳ ಸಂಖ್ಯೆ:', hi: 'व्यक्तियों की संख्या:' },
  [UITranslationKeys.PDF_SELECTED_DISHES_TITLE]: { en: 'Selected Dishes:', te: 'ఎంచుకున్న వంటకాలు:', ta: 'தேர்ந்தெடுக்கப்பட்ட உணவுகள்:', kn: 'ಆಯ್ದ ಭಕ್ಷ್ಯಗಳು:', hi: 'चयनित व्यंजन:' },
  [UITranslationKeys.PDF_NO_DISHES_SELECTED]: { en: '(No dishes selected)', te: '(వంటకాలు ఏవీ ఎంచుకోబడలేదు)', ta: '(உணவுகள் எதுவும் தேர்ந்தெடுக்கப்படவில்லை)', kn: '(ಯಾವುದೇ ಭಕ್ಷ್ಯಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಲಾಗಿಲ್ಲ)', hi: '(कोई व्यंजन चयनित नहीं)' },
  [UITranslationKeys.PDF_REQUIRED_INGREDIENTS_TITLE]: { en: 'Required Ingredients', te: 'అవసరమైన పదార్థాలు', ta: 'தேவையான பொருட்கள்', kn: 'ಅಗತ್ಯವಿರುವ ಪದಾರ್ಥಗಳು', hi: 'आवश्यक सामग्री' },
  [UITranslationKeys.PDF_INGREDIENTS_TABLE_HEADER_NAME]: { en: 'Ingredient', te: 'పదార్ధం', ta: 'பொருள்', kn: 'ಪದಾರ್ಥ', hi: 'सामग्री' },
  [UITranslationKeys.PDF_INGREDIENTS_TABLE_HEADER_QUANTITY]: { en: 'Quantity', te: 'పరిమాణం', ta: 'அளவு', kn: 'ಪ್ರಮಾಣ', hi: 'मात्रा' },
  [UITranslationKeys.PDF_INGREDIENTS_TABLE_HEADER_UNIT]: { en: 'Unit', te: 'యూనిట్', ta: 'அலகு', kn: 'ಘಟಕ', hi: 'इकाई' },
  [UITranslationKeys.PDF_NO_INGREDIENTS_CALCULATED]: { en: '(No ingredients calculated)', te: '(పదార్థాలు ఏవీ లెక్కించబడలేదు)', ta: '(பொருட்கள் எதுவும் கணக்கிடப்படவில்லை)', kn: '(ಯಾವುದೇ ಪದಾರ್ಥಗಳನ್ನು ಲೆಕ್ಕ ಹಾಕಲಾಗಿಲ್ಲ)', hi: '(कोई सामग्री गणना नहीं की गई)' },
  [UITranslationKeys.PDF_SELECTED_COOKING_ITEMS_TITLE]: { en: 'Selected Cooking Items', te: 'ఎంచుకున్న వంట సామాగ్రి', ta: 'தேர்ந்தெடுக்கப்பட்ட சமையல் பொருட்கள்', kn: 'ಆಯ್ದ ಅಡುಗೆ ಸಾಮಗ್ರಿಗಳು', hi: 'चयनित खाना पकाने की सामग्री' },
  [UITranslationKeys.PDF_COOKING_ITEMS_TABLE_HEADER_NAME]: { en: 'Item', te: 'వస్తువు', ta: 'பொருள்', kn: 'ವಸ್ತು', hi: 'वस्तु' },
  [UITranslationKeys.PDF_COOKING_ITEMS_TABLE_HEADER_QUANTITY]: { en: 'Quantity', te: 'పరిమాణం', ta: 'அளவு', kn: 'ಪ್ರಮಾಣ', hi: 'मात्रा' },
  [UITranslationKeys.PDF_COOKING_ITEMS_TABLE_HEADER_UNIT]: { en: 'Unit', te: 'యూనిట్', ta: 'అలகு', kn: 'ಘಟಕ', hi: 'इकाई' },
  [UITranslationKeys.PDF_NO_COOKING_ITEMS_SELECTED]: { en: '(No cooking items selected)', te: '(వంట సామాగ్రి ఏవీ ఎంచుకోబడలేదు)', ta: '(சமையல் பொருட்கள் எதுவும் தேர்ந்தெடுக்கப்படவில்லை)', kn: '(ಯಾವುದೇ ಅಡುಗೆ ಸಾಮಾನುಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಲಾಗಿಲ್ಲ)', hi: '(कोई खाना पकाने की सामग्री चयनित नहीं)' },
  [UITranslationKeys.PDF_THANK_YOU_MESSAGE]: { en: 'Thank you for your order!', te: 'మీ ఆర్డర్‌కు ధన్యవాదాలు!', ta: 'உங்கள் ஆர்டருக்கு நன்றி!', kn: 'ನಿಮ್ಮ ಆರ್ಡರ್‌ಗಾಗಿ ಧನ್ಯವಾದಗಳು!', hi: 'आपके आदेश के लिए धन्यवाद!' },
  [UITranslationKeys.PDF_PREPARED_BY_LABEL]: { en: 'Prepared By:', te: 'తయారుచేసిన వారు:', ta: 'தயாரித்தவர்:', kn: 'ತಯಾರಿಸಿದವರು:', hi: 'द्वारा तैयार:' },
  [UITranslationKeys.PDF_USER_PHONE_LABEL]: { en: 'Contact:', te: 'సంప్రదించండి:', ta: 'தொடர்புக்கு:', kn: 'ಸಂಪರ್ಕಿಸಿ:', hi: 'संपर्क करें:' },
  [UITranslationKeys.PDF_USER_ADDRESS_LABEL]: { en: 'Location:', te: 'స్థలం:', ta: 'இடம்:', kn: 'ಸ್ಥಳ:', hi: 'स्थान:' },
  [UITranslationKeys.PDF_USER_CATERING_NAME_LABEL]: { en: 'Catering Service:', te: 'క్యాటరింగ్ సర్వీస్:', ta: 'கேட்டரிங் சேவை:', kn: 'ಕೇಟರಿಂಗ್ ಸೇವೆ:', hi: 'कैटरिंग सेवा:' },
  [UITranslationKeys.PDF_USER_LOGO_ALT]: { en: 'Catering Logo', te: 'క్యాటరింగ్ లోగో', ta: 'கேட்டரிங் லோகோ', kn: 'ಕೇಟರಿಂಗ್ ಲೋಗೋ', hi: 'कैटरिंग लोगो' },
  [UITranslationKeys.PDF_PAGE_LABEL]: { en: 'Page', te: 'పేజీ', ta: 'பக்கம்', kn: 'ಪುಟ', hi: 'पृष्ठ' },
  [UITranslationKeys.PDF_OF_LABEL]: { en: 'of', te: 'లో', ta: 'இல்', kn: 'ನ', hi: 'का' },

  // Excel related
  [UITranslationKeys.EXCEL_EXPORT_INGREDIENTS_BUTTON]: { en: 'Export Excel', te: 'Excel ఎగుమతి చేయండి', ta: 'Excel ஏற்றுமதி செய்', kn: 'Excel ರಫ್ತು ಮಾಡಿ', hi: 'एक्सेल निर्यात करें' },
  [UITranslationKeys.EXCEL_IMPORT_INGREDIENTS_BUTTON]: { en: 'Import Excel', te: 'Excel దిగుమతి చేయండి', ta: 'Excel இறக்குமதி செய்', kn: 'Excel ಆಮದು ಮಾಡಿ', hi: 'एक्सेल आयात करें' },
  [UITranslationKeys.EXCEL_IMPORT_SUCCESS_ALERT]: { en: 'Ingredients imported/updated successfully from Excel!', te: 'Excel నుండి పదార్థాలు విజయవంతంగా దిగుమతి/నవీకరించబడ్డాయి!', ta: 'Excel இலிருந்து பொருட்கள் வெற்றிகரமாக இறக்குமதி/புதுப்பிக்கப்பட்டன!', kn: 'Excel ಯಿಂದ ಪದಾರ್ಥಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಆಮದು/ನವೀಕರಿಸಲಾಗಿದೆ!', hi: 'एक्सेल से सामग्री सफलतापूर्वक आयात/अद्यतन की गई!' },
  [UITranslationKeys.EXCEL_IMPORT_FAILURE_ALERT]: { en: 'Failed to process Excel file.', te: 'Excel ఫైల్‌ను ప్రాసెస్ చేయడంలో విఫలమైంది.', ta: 'Excel கோப்பைச் செயலாக்குவதில் தோல்வி.', kn: 'Excel ಫೈಲ್ ಅನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲು ವಿಫಲವಾಗಿದೆ.', hi: 'एक्सेल फ़ाइल को संसाधित करने में विफल।' },
  [UITranslationKeys.EXCEL_INVALID_FILE_FORMAT_ALERT]: { en: 'Invalid file format. Please upload an Excel (.xlsx) file.', te: 'చెల్లని ఫైల్ ఫార్మాట్. దయచేసి Excel (.xlsx) ఫైల్‌ను అప్‌లోడ్ చేయండి.', ta: 'தவறான கோப்பு வடிவம். Excel (.xlsx) கோப்பைப் பதிவேற்றவும்.', kn: 'ಅಮಾನ್ಯ ಫೈಲ್ ಫಾರ್ಮ್ಯಾಟ್. ದಯವಿಟ್ಟು Excel (.xlsx) ಫೈಲ್ ಅನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.', hi: 'अमान्य फ़ाइल स्वरूप। कृपया एक एक्सेल (.xlsx) फ़ाइल अपलोड करें।' },
  [UITranslationKeys.EXCEL_NO_FILE_SELECTED_ALERT]: { en: 'No file selected. Please choose an Excel file to import.', te: 'ఫైల్ ఏదీ ఎంచుకోబడలేదు. దయచేసి దిగుమతి చేయడానికి Excel ఫైల్‌ను ఎంచుకోండి.', ta: 'கோப்பு எதுவும் தேர்ந்தெடுக்கப்படவில்லை. இறக்குமதி செய்ய Excel கோப்பைத் தேர்ந்தெடுக்கவும்.', kn: 'ಯಾವುದೇ ಫೈಲ್ ಆಯ್ಕೆ ಮಾಡಲಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ಆಮದು ಮಾಡಲು Excel ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ.', hi: 'कोई फ़ाइल चयनित नहीं है। कृपया आयात करने के लिए एक एक्सेल फ़ाइल चुनें।' },
  [UITranslationKeys.EXCEL_HEADER_MISMATCH_ALERT]: { en: 'Excel header mismatch. Expected headers: {expectedHeaders}. Actual headers: {actualHeaders}', te: 'Excel హెడర్ సరిపోలడం లేదు. ఆశించిన హెడర్‌లు: {expectedHeaders}. వాస్తవ హెడర్‌లు: {actualHeaders}', ta: 'Excel தலைப்பு பொருந்தவில்லை. எதிர்பார்க்கப்படும் தலைப்புகள்: {expectedHeaders}. உண்மையான தலைப்புகள்: {actualHeaders}', kn: 'Excel ಹೆಡರ್ ಹೊಂದಾಣಿಕೆಯಾಗುತ್ತಿಲ್ಲ. ನಿರೀಕ್ಷಿತ ಹೆಡರ್‌ಗಳು: {expectedHeaders}. ನಿಜವಾದ ಹೆಡರ್‌ಗಳು: {actualHeaders}', hi: 'एक्सेल हेडर बेमेल। अपेक्षित हेडर: {expectedHeaders}। वास्तविक हेडर: {actualHeaders}' },
  
  // General Alerts
  [UITranslationKeys.ALERT_PERMISSION_DENIED]: { en: 'Permission Denied.', te: 'అనుమతి నిరాకరించబడింది.', ta: 'அனுமதி மறுக்கப்பட்டது.', kn: 'ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ.', hi: 'अनुमति अस्वीकृत।' },
  [UITranslationKeys.ALERT_INGREDIENTS_EXPORTED_SUCCESS]: { en: 'Ingredients exported successfully to Excel!', te: 'పదార్థాలు Excelకి విజయవంతంగా ఎగుమతి చేయబడ్డాయి!', ta: 'பொருட்கள் Excelக்கு வெற்றிகரமாக ஏற்றுமதி செய்யப்பட்டன!', kn: 'ಪದಾರ್ಥಗಳನ್ನು Excel ಗೆ ಯಶಸ್ವಿಯಾಗಿ ರಫ್ತು ಮಾಡಲಾಗಿದೆ!', hi: 'सामग्री सफलतापूर्वक एक्सेल में निर्यात की गई!' },

  // Customer Order Actions
  [UITranslationKeys.HTML_VIEW_ORDER_BUTTON]: { en: 'View HTML', te: 'HTML చూడండి', ta: 'HTML காண்க', kn: 'HTML ವೀಕ್ಷಿಸಿ', hi: 'एचटीएमएल देखें' },
  [UITranslationKeys.PRINT_ORDER_BUTTON]: { en: 'Print Order', te: 'ఆర్డర్‌ను ముద్రించండి', ta: 'ஆர்டரை அச்சிடு', kn: 'ಆರ್ಡರ್ ಮುದ್ರಿಸಿ', hi: 'आदेश प्रिंट करें' },
};

export const getUIText = (key: UITranslationKeys, preferredLang: Language, fallbackLang: Language = Language.EN, replacements?: {[key:string]: string}): string => {
  const translationsForKey = uiTranslations[key];
  if (!translationsForKey) {
    // console.warn(`No UI translations found for key: ${key}`);
    return key; // Return the key itself as a fallback
  }
  let translatedString = translationsForKey[preferredLang] || translationsForKey[fallbackLang];
  
  if (!translatedString) {
    // Fallback to the first available language if preferred and EN fallback are not found
    for (const langKey in translationsForKey) {
      if (translationsForKey[langKey as Language]) {
        translatedString = translationsForKey[langKey as Language]!;
        break;
      }
    }
  }

  if (!translatedString) {
    // console.warn(`No translation found for UI key: ${key} in any language.`);
    return key; // Return the key itself if no translations are available at all
  }

  if (replacements) {
    Object.keys(replacements).forEach(placeholder => {
      translatedString = translatedString!.replace(`{${placeholder}}`, replacements[placeholder]);
    });
  }
  return translatedString!;
};