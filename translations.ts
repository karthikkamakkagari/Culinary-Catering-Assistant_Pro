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
  [UITranslationKeys.PRICE_LABEL]: {
    [Language.EN]: 'Price (₹)',
    [Language.TE]: 'ధర (₹)',
    [Language.TA]: 'விலை (₹)',
    [Language.KN]: 'ಬೆಲೆ (₹)',
    [Language.HI]: 'मूल्य (₹)'
  },
  [UITranslationKeys.COST_LABEL]: {
    [Language.EN]: 'Cost: ₹{cost}',
    [Language.TE]: 'ఖర్చు: ₹{cost}',
    [Language.TA]: 'செலவு: ₹{cost}',
    [Language.KN]: 'ವೆಚ್ಚ: ₹{cost}',
    [Language.HI]: 'लागत: ₹{cost}'
  },
  [UITranslationKeys.TOTAL_COST_LABEL]: {
    [Language.EN]: 'Total Cost: ₹{totalCost}',
    [Language.TE]: 'మొత్తం ఖర్చు: ₹{totalCost}',
    [Language.TA]: 'மொத்த செலவு: ₹{totalCost}',
    [Language.KN]: 'ಒಟ್ಟು ವೆಚ್ಚ: ₹{totalCost}',
    [Language.HI]: 'कुल लागत: ₹{totalCost}'
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
  [UITranslationKeys.INGREDIENT_PRICE_FOR_QTY_UNIT_LABEL]: {
    [Language.EN]: 'Price (₹) for this Quantity & Unit',
    [Language.TE]: 'ఈ పరిమాణం & యూనిట్‌కు ధర (₹)',
    [Language.TA]: 'இந்த அளவு மற்றும் அலகுக்கான விலை (₹)',
    [Language.KN]: 'ಈ ಪ್ರಮಾಣ ಮತ್ತು ಘಟಕಕ್ಕೆ ಬೆಲೆ (₹)',
    [Language.HI]: 'इस मात्रा और इकाई के लिए मूल्य (₹)'
  },
  // Dishes
  [UITranslationKeys.DISHES_PAGE_TITLE]: {
    [Language.EN]: 'Dishes',
    [Language.TE]: 'వంటకాలు',
    [Language.TA]: 'உணவுகள்',
    [Language.KN]: 'ಭಕ್ಷ್ಯಗಳು',
    [Language.HI]: 'व्यंजन'
  },
  [UITranslationKeys.ADD_DISH_TITLE]: {
    [Language.EN]: 'Add Dish',
    [Language.TE]: 'వంటకాన్ని జోడించండి',
    [Language.TA]: 'உணவைச் சேர்',
    [Language.KN]: 'ಭಕ್ಷ್ಯವನ್ನು ಸೇರಿಸಿ',
    [Language.HI]: 'व्यंजन जोड़ें'
  },
  [UITranslationKeys.EDIT_DISH_TITLE]: {
    [Language.EN]: 'Edit Dish',
    [Language.TE]: 'వంటకాన్ని సవరించండి',
    [Language.TA]: 'உணவைத் திருத்து',
    [Language.KN]: 'ಭಕ್ಷ್ಯವನ್ನು ಸಂಪಾದಿಸಿ',
    [Language.HI]: 'व्यंजन संपादित करें'
  },
  [UITranslationKeys.DISH_NAME_LABEL]: {
    [Language.EN]: 'Dish Name',
    [Language.TE]: 'వంటకం పేరు',
    [Language.TA]: 'உணவு பெயர்',
    [Language.KN]: 'ಭಕ್ಷ್ಯದ ಹೆಸರು',
    [Language.HI]: 'व्यंजन का नाम'
  },
  [UITranslationKeys.PREPARATION_STEPS_LABEL]: {
    [Language.EN]: 'Preparation Steps',
    [Language.TE]: 'తయారీ దశలు',
    [Language.TA]: 'தயாரிப்பு படிகள்',
    [Language.KN]: 'ತಯಾರಿಕೆಯ ಹಂತಗಳು',
    [Language.HI]: 'तैयारी के चरण'
  },
  [UITranslationKeys.SELECT_INGREDIENTS_LABEL]: {
    [Language.EN]: 'Select Ingredients',
    [Language.TE]: 'పదార్థాలను ఎంచుకోండి',
    [Language.TA]: 'பொருட்களைத் தேர்ந்தெடுக்கவும்',
    [Language.KN]: 'ಪದಾರ್ಥಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    [Language.HI]: 'सामग्री चुनें'
  },
  [UITranslationKeys.NO_INGREDIENTS_AVAILABLE]: {
    [Language.EN]: 'No ingredients available. Please add some first.',
    [Language.TE]: 'పదార్థాలు అందుబాటులో లేవు. దయచేసి ముందుగా కొన్ని జోడించండి.',
    [Language.TA]: 'பொருட்கள் எதுவும் கிடைக்கவில்லை. முதலில் சிலவற்றைச் சேர்க்கவும்.',
    [Language.KN]: 'ಯಾವುದೇ ಪದಾರ್ಥಗಳು ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಮೊದಲು ಕೆಲವನ್ನು ಸೇರಿಸಿ.',
    [Language.HI]: 'कोई सामग्री उपलब्ध नहीं है। कृपया पहले कुछ जोड़ें।'
  },
  [UITranslationKeys.DISH_COST_LABEL]: {
    [Language.EN]: 'Est. Dish Cost: ₹{cost}',
    [Language.TE]: 'అంచనా వంటకం ఖర్చు: ₹{cost}',
    [Language.TA]: 'மதிப்பிடப்பட்ட உணவு செலவு: ₹{cost}',
    [Language.KN]: 'ಅಂದಾಜು ಭಕ್ಷ್ಯ ವೆಚ್ಚ: ₹{cost}',
    [Language.HI]: 'अनुमानित व्यंजन लागत: ₹{cost}'
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
  [UITranslationKeys.COOKING_ITEM_PRICE_PER_UNIT_LABEL]: {
    [Language.EN]: 'Price (₹) per Unit',
    [Language.TE]: 'యూనిట్‌కు ధర (₹)',
    [Language.TA]: 'ஒரு அலகுக்கான விலை (₹)',
    [Language.KN]: 'ಪ್ರತಿ ಘಟಕಕ್ಕೆ ಬೆಲೆ (₹)',
    [Language.HI]: 'प्रति इकाई मूल्य (₹)'
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
  [UITranslationKeys.PDF_INGREDIENTS_TABLE_HEADER_PRICE]: { en: 'Total Price (₹)', te: 'మొత్తం ధర (₹)', ta: 'மொத்த விலை (₹)', kn: 'ಒಟ್ಟು ಬೆಲೆ (₹)', hi: 'कुल मूल्य (₹)' },
  [UITranslationKeys.PDF_NO_INGREDIENTS_CALCULATED]: { en: '(No ingredients calculated)', te: '(పదార్థాలు ఏవీ లెక్కించబడలేదు)', ta: '(பொருட்கள் எதுவும் கணக்கிடப்படவில்லை)', kn: '(ಯಾವುದೇ ಪದಾರ್ಥಗಳನ್ನು ಲೆಕ್ಕ ಹಾಕಲಾಗಿಲ್ಲ)', hi: '(कोई सामग्री गणना नहीं की गई)' },
  [UITranslationKeys.PDF_SELECTED_COOKING_ITEMS_TITLE]: { en: 'Selected Cooking Items', te: 'ఎంచుకున్న వంట సామాగ్రి', ta: 'தேர்ந்தெடுக்கப்பட்ட சமையல் பொருட்கள்', kn: 'ಆಯ್ದ ಅಡುಗೆ ಸಾಮಗ್ರಿಗಳು', hi: 'चयनित खाना पकाने की सामग्री' },
  [UITranslationKeys.PDF_COOKING_ITEMS_TABLE_HEADER_NAME]: { en: 'Item', te: 'వస్తువు', ta: 'பொருள்', kn: 'ವಸ್ತು', hi: 'वस्तु' },
  [UITranslationKeys.PDF_COOKING_ITEMS_TABLE_HEADER_QUANTITY]: { en: 'Quantity', te: 'పరిమాణం', ta: 'அளவு', kn: 'ಪ್ರಮಾಣ', hi: 'मात्रा' },
  [UITranslationKeys.PDF_COOKING_ITEMS_TABLE_HEADER_UNIT]: { en: 'Unit', te: 'యూనిట్', ta: 'அலகு', kn: 'ಘಟಕ', hi: 'इकाई' },
  [UITranslationKeys.PDF_COOKING_ITEMS_TABLE_HEADER_PRICE_PER_UNIT]: { en: 'Price/Unit (₹)', te: 'ధర/యూనిట్ (₹)', ta: 'விலை/அலகு (₹)', kn: 'ಬೆಲೆ/ಘಟಕ (₹)', hi: 'मूल्य/इकाई (₹)' },
  [UITranslationKeys.PDF_COOKING_ITEMS_TABLE_HEADER_TOTAL_PRICE]: { en: 'Total Price (₹)', te: 'మొత్తం ధర (₹)', ta: 'மொத்த விலை (₹)', kn: 'ಒಟ್ಟು ಬೆಲೆ (₹)', hi: 'कुल मूल्य (₹)' },
  [UITranslationKeys.PDF_NO_COOKING_ITEMS_SELECTED]: { en: '(No cooking items selected)', te: '(వంట సామాగ్రి ఏవీ ఎంచుకోబడలేదు)', ta: '(சமையல் பொருட்கள் எதுவும் தேர்ந்தெடுக்கப்படவில்லை)', kn: '(ಯಾವುದೇ ಅಡುಗೆ ಸಾಮಾನುಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಲಾಗಿಲ್ಲ)', hi: '(कोई खाना पकाने की सामग्री चयनित नहीं)' },
  [UITranslationKeys.PDF_TOTAL_ORDER_COST_LABEL]: { en: 'Total Order Cost: ₹{totalCost}', te: 'మొత్తం ఆర్డర్ ఖర్చు: ₹{totalCost}', ta: 'மொத்த ஆர்டர் செலவு: ₹{totalCost}', kn: 'ಒಟ್ಟು ಆರ್ಡರ್ ವೆಚ್ಚ: ₹{totalCost}', hi: 'कुल आदेश लागत: ₹{totalCost}' },
  [UITranslationKeys.PDF_THANK_YOU_MESSAGE]: { en: 'Thank you for your order!', te: 'మీ ఆర్డర్‌కు ధన్యవాదాలు!', ta: 'உங்கள் ஆர்டருக்கு நன்றி!', kn: 'ನಿಮ್ಮ ಆರ್ಡರ್‌ಗಾಗಿ ಧನ್ಯವಾದಗಳು!', hi: 'आपके आदेश के लिए धन्यवाद!' },
  [UITranslationKeys.PDF_PREPARED_BY_LABEL]: { en: 'Prepared By:', te: 'తయారుచేసిన వారు:', ta: 'தயாரித்தவர்:', kn: 'ತಯಾರಿಸಿದವರು:', hi: 'द्वारा तैयार:' },
  [UITranslationKeys.PDF_USER_PHONE_LABEL]: { en: 'Contact:', te: 'సంప్రదించండి:', ta: 'தொடர்புக்கு:', kn: 'ಸಂಪರ್ಕಿಸಿ:', hi: 'संपर्क करें:' },
  [UITranslationKeys.PDF_USER_ADDRESS_LABEL]: { en: 'Location:', te: 'స్థలం:', ta: 'இடம்:', kn: 'ಸ್ಥಳ:', hi: 'स्थान:' },
  [UITranslationKeys.PDF_USER_CATERING_NAME_LABEL]: { en: 'Catering Service:', te: 'క్యాటరింగ్ సర్వీస్:', ta: 'கேட்டரிங் சேவை:', kn: 'ಕೇಟರಿಂಗ್ ಸೇವೆ:', hi: 'कैटरिंग सेवा:' },
  [UITranslationKeys.PDF_USER_LOGO_ALT]: { en: 'Catering Logo', te: 'క్యాటరింగ్ లోగో', ta: 'கேட்டரிங் லோகோ', kn: 'ಕೇಟರಿಂಗ್ ಲೋಗೋ', hi: 'कैटरिंग लोगो' },
  [UITranslationKeys.PDF_PAGE_LABEL]: { en: 'Page', te: 'పేజీ', ta: 'பக்கம்', kn: 'ಪುಟ', hi: 'पृष्ठ' },
  [UITranslationKeys.PDF_OF_LABEL]: { en: 'of', te: 'లో', ta: 'இல்', kn: 'ನ', hi: 'का' },

  // Excel related
  [UITranslationKeys.EXCEL_EXPORT_INGREDIENTS_BUTTON]: { en: 'Export Ingredients', te: 'పదార్థాలను Excel ఎగుమతి చేయండి', ta: 'பொருட்களை Excel ஏற்றுமதி செய்', kn: 'ಪದಾರ್ಥಗಳನ್ನು Excel ರಫ್ತು ಮಾಡಿ', hi: 'सामग्री एक्सेल निर्यात करें' },
  [UITranslationKeys.EXCEL_IMPORT_INGREDIENTS_BUTTON]: { en: 'Import Ingredients', te: 'పదార్థాలను Excel దిగుమతి చేయండి', ta: 'பொருட்களை Excel இறக்குமதி செய்', kn: 'ಪದಾರ್ಥಗಳನ್ನು Excel ಆಮದು ಮಾಡಿ', hi: 'सामग्री एक्सेल आयात करें' },
  [UITranslationKeys.EXCEL_IMPORT_SUCCESS_ALERT]: { en: 'Data imported/updated successfully from Excel!', te: 'Excel నుండి డేటా విజయవంతంగా దిగుమతి/నవీకరించబడింది!', ta: 'Excel இலிருந்து தரவு வெற்றிகரமாக இறக்குமதி/புதுப்பிக்கப்பட்டது!', kn: 'Excel ನಿಂದ ಡೇಟಾವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಆಮದು/ನವೀಕರಿಸಲಾಗಿದೆ!', hi: 'एक्सेल से डेटा सफलतापूर्वक आयात/अद्यतन किया गया!' },
  [UITranslationKeys.EXCEL_IMPORT_FAILURE_ALERT]: { en: 'Failed to process Excel file.', te: 'Excel ఫైల్‌ను ప్రాసెస్ చేయడంలో విఫలమైంది.', ta: 'Excel கோப்பைச் செயலாக்குவதில் தோல்வி.', kn: 'Excel ಫೈಲ್ ಅನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲು ವಿಫಲವಾಗಿದೆ.', hi: 'एक्सेल फ़ाइल को संसाधित करने में विफल।' },
  [UITranslationKeys.EXCEL_INVALID_FILE_FORMAT_ALERT]: { en: 'Invalid file format. Please upload an Excel (.xlsx) file.', te: 'చెల్లని ఫైల్ ఫార్మాట్. దయచేసి Excel (.xlsx) ఫైల్‌ను అప్‌లోడ్ చేయండి.', ta: 'தவறான கோப்பு வடிவம். Excel (.xlsx) கோப்பைப் பதிவேற்றவும்.', kn: 'ಅಮಾನ್ಯ ಫೈಲ್ ಫಾರ್ಮ್ಯಾಟ್. ದಯವಿಟ್ಟು Excel (.xlsx) ಫೈಲ್ ಅನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.', hi: 'अमान्य फ़ाइल स्वरूप। कृपया एक एक्सेल (.xlsx) फ़ाइल अपलोड करें।' },
  [UITranslationKeys.EXCEL_NO_FILE_SELECTED_ALERT]: { en: 'No file selected. Please choose an Excel file to import.', te: 'ఫైల్ ఏదీ ఎంచుకోబడలేదు. దయచేసి దిగుమతి చేయడానికి Excel ఫైల్‌ను ఎంచుకోండి.', ta: 'கோப்பு எதுவும் தேர்ந்தெடுக்கப்படவில்லை. இறக்குமதி செய்ய Excel கோப்பைத் தேர்ந்தெடுக்கவும்.', kn: 'ಯಾವುದೇ ಫೈಲ್ ಆಯ್ಕೆ ಮಾಡಲಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ಆಮದು ಮಾಡಲು Excel ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ.', hi: 'कोई फ़ाइल चयनित नहीं है। कृपया आयात करने के लिए एक एक्सेल फ़ाइल चुनें।' },
  [UITranslationKeys.EXCEL_HEADER_MISMATCH_ALERT]: { en: 'Excel header mismatch. Expected headers: {expectedHeaders}. Actual headers: {actualHeaders}', te: 'Excel హెడర్ సరిపోలడం లేదు. ఆశించిన హెడర్‌లు: {expectedHeaders}. వాస్తవ హెడర్‌లు: {actualHeaders}', ta: 'Excel தலைப்பு பொருந்தவில்லை. எதிர்பார்க்கப்படும் தலைப்புகள்: {expectedHeaders}. உண்மையான தலைப்புகள்: {actualHeaders}', kn: 'Excel ಹೆಡರ್ ಹೊಂದಾಣಿಕೆಯಾಗುತ್ತಿಲ್ಲ. ನಿರೀಕ್ಷಿತ ಹೆಡರ್‌ಗಳು: {expectedHeaders}. ನಿಜವಾದ ಹೆಡರ್‌ಗಳು: {actualHeaders}', hi: 'एक्सेल हेडर बेमेल। अपेक्षित हेडर: {expectedHeaders}। वास्तविक हेडर: {actualHeaders}' },
  [UITranslationKeys.EXCEL_EXPORT_DISHES_BUTTON]: { en: 'Export Dishes', te: 'వంటకాలను Excel ఎగుమతి చేయండి', ta: 'உணவுகளை Excel ஏற்றுமதி செய்', kn: 'ಭಕ್ಷ್ಯಗಳನ್ನು Excel ರಫ್ತು ಮಾಡಿ', hi: 'व्यंजन एक्सेल निर्यात करें' },
  [UITranslationKeys.EXCEL_IMPORT_DISHES_BUTTON]: { en: 'Import Dishes', te: 'వంటకాలను Excel దిగుమతి చేయండి', ta: 'உணவுகளை Excel இறக்குமதி செய்', kn: 'ಭಕ್ಷ್ಯಗಳನ್ನು Excel ಆಮದು ಮಾಡಿ', hi: 'व्यंजन एक्सेल आयात करें' },
  [UITranslationKeys.ALERT_DISHES_EXPORTED_SUCCESS]: { en: 'Dishes exported successfully to Excel!', te: 'వంటకాలు Excelకి విజయవంతంగా ఎగుమతి చేయబడ్డాయి!', ta: 'உணவுகள் Excelக்கு வெற்றிகரமாக ஏற்றுமதி செய்யப்பட்டன!', kn: 'ಭಕ್ಷ್ಯಗಳನ್ನು Excel ಗೆ ಯಶಸ್ವಿಯಾಗಿ ರಫ್ತು ಮಾಡಲಾಗಿದೆ!', hi: 'व्यंजन सफलतापूर्वक एक्सेल में निर्यात किए गए!' },
  [UITranslationKeys.ALERT_DISHES_IMPORTED_SUCCESS]: { en: 'Dishes imported/updated successfully from Excel!', te: 'Excel నుండి వంటకాలు విజయవంతంగా దిగుమతి/నవీకరించబడ్డాయి!', ta: 'Excel இலிருந்து உணவுகள் வெற்றிகரமாக இறக்குமதி/புதுப்பிக்கப்பட்டன!', kn: 'Excel ನಿಂದ ಭಕ್ಷ್ಯಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಆಮದು/ನವೀಕರಿಸಲಾಗಿದೆ!', hi: 'एक्सेल से व्यंजन सफलतापूर्वक आयात/अद्यतन किए गए!' },
  [UITranslationKeys.EXCEL_DISH_IMPORT_INVALID_INGREDIENT_ID]: { en: 'Invalid ingredient ID "{ingredientId}" found in ingredients JSON for dish "{dishName}".', te: '"{dishName}" వంటకం కోసం పదార్థాల JSONలో చెల్లని పదార్థం ID "{ingredientId}" కనుగొనబడింది.', ta: '"{dishName}" உணவுக்கான பொருட்கள் JSON இல் தவறான பொருள் ஐடி "{ingredientId}" கண்டறியப்பட்டது.', kn: '"{dishName}" ಭಕ್ಷ್ಯಕ್ಕಾಗಿ ಪದಾರ್ಥಗಳ JSON ನಲ್ಲಿ ಅಮಾನ್ಯ ಪದಾರ್ಥ ID "{ingredientId}" ಕಂಡುಬಂದಿದೆ.', hi: '"{dishName}" व्यंजन के लिए सामग्री JSON में अमान्य सामग्री आईडी "{ingredientId}" मिली।' },
  [UITranslationKeys.EXCEL_DISH_IMPORT_INVALID_INGREDIENT_QUANTITY]: { en: 'Invalid quantity for ingredient ID "{ingredientId}" in dish "{dishName}".', te: '"{dishName}" వంటకంలో పదార్థం ID "{ingredientId}" కోసం చెల్లని పరిమాణం.', ta: '"{dishName}" உணவில் "{ingredientId}" பொருள் ஐடிக்கான தவறான அளவு.', kn: '"{dishName}" ಭಕ್ಷ್ಯದಲ್ಲಿ ಪದಾರ್ಥ ID "{ingredientId}" ಗಾಗಿ ಅಮಾನ್ಯ ಪ್ರಮಾಣ.', hi: '"{dishName}" व्यंजन में सामग्री आईडी "{ingredientId}" के लिए अमान्य मात्रा।' },
  [UITranslationKeys.EXCEL_DISH_IMPORT_INVALID_INGREDIENTS_JSON]: { en: 'Invalid ingredients JSON string for dish "{dishName}". Error: {error}', te: '"{dishName}" వంటకం కోసం చెల్లని పదార్థాల JSON స్ట్రింగ్. లోపం: {error}', ta: '"{dishName}" உணவுக்கான தவறான பொருட்கள் JSON சரம். பிழை: {error}', kn: '"{dishName}" ಭಕ್ಷ್ಯಕ್ಕಾಗಿ ಅಮಾನ್ಯ ಪದಾರ್ಥಗಳ JSON ಸ್ಟ್ರಿಂಗ್. ದೋಷ: {error}', hi: '"{dishName}" व्यंजन के लिए अमान्य सामग्री JSON स्ट्रिंग। त्रुटि: {error}' },
  [UITranslationKeys.EXCEL_EXPORT_COOKING_ITEMS_BUTTON]: { en: 'Export Cooking Items', te: 'వంట సామాగ్రిని Excel ఎగుమతి చేయండి', ta: 'சமையல் பொருட்களை Excel ஏற்றுமதி செய்', kn: 'ಅಡುಗೆ ಸಾಮಾನುಗಳನ್ನು Excel ರಫ್ತು ಮಾಡಿ', hi: 'खाना पकाने की सामग्री एक्सेल निर्यात करें' },
  [UITranslationKeys.EXCEL_IMPORT_COOKING_ITEMS_BUTTON]: { en: 'Import Cooking Items', te: 'వంట సామాగ్రిని Excel దిగుమతి చేయండి', ta: 'சமையல் பொருட்களை Excel இறக்குமதி செய்', kn: 'ಅಡುಗೆ ಸಾಮಾನುಗಳನ್ನು Excel ಆಮದು ಮಾಡಿ', hi: 'खाना पकाने की सामग्री एक्सेल आयात करें' },
  [UITranslationKeys.ALERT_COOKING_ITEMS_EXPORTED_SUCCESS]: { en: 'Cooking items exported successfully to Excel!', te: 'వంట సామాగ్రి Excelకి విజయవంతంగా ఎగుమతి చేయబడ్డాయి!', ta: 'சமையல் பொருட்கள் Excelக்கு வெற்றிகரமாக ஏற்றுமதி செய்யப்பட்டன!', kn: 'ಅಡುಗೆ ಸಾಮಾನುಗಳನ್ನು Excel ಗೆ ಯಶಸ್ವಿಯಾಗಿ ರಫ್ತು ಮಾಡಲಾಗಿದೆ!', hi: 'खाना पकाने की सामग्री सफलतापूर्वक एक्सेल में निर्यात की गई!' },
  [UITranslationKeys.ALERT_COOKING_ITEMS_IMPORTED_SUCCESS]: { en: 'Cooking items imported/updated successfully from Excel!', te: 'Excel నుండి వంట సామాగ్రి విజయవంతంగా దిగుమతి/నవీకరించబడ్డాయి!', ta: 'Excel இலிருந்து சமையல் பொருட்கள் வெற்றிகரமாக இறக்குமதி/புதுப்பிக்கப்பட்டன!', kn: 'Excel ನಿಂದ ಅಡುಗೆ ಸಾಮಾನುಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಆಮದು/ನವೀಕರಿಸಲಾಗಿದೆ!', hi: 'एक्सेल से खाना पकाने की सामग्री सफलतापूर्वक आयात/अद्यतन की गई!' },


  // General Alerts
  [UITranslationKeys.ALERT_PERMISSION_DENIED]: { en: 'Permission Denied.', te: 'అనుమతి నిరాకరించబడింది.', ta: 'அனுமதி மறுக்கப்பட்டது.', kn: 'ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ.', hi: 'अनुमति अस्वीकृत।' },
  [UITranslationKeys.ALERT_INGREDIENTS_EXPORTED_SUCCESS]: { en: 'Ingredients exported successfully to Excel!', te: 'పదార్థాలు Excelకి విజయవంతంగా ఎగుమతి చేయబడ్డాయి!', ta: 'பொருட்கள் Excelக்கு வெற்றிகரமாக ஏற்றுமதி செய்யப்பட்டன!', kn: 'ಪದಾರ್ಥಗಳನ್ನು Excel ಗೆ ಯಶಸ್ವಿಯಾಗಿ ರಫ್ತು ಮಾಡಲಾಗಿದೆ!', hi: 'सामग्री सफलतापूर्वक एक्सेल में निर्यात की गई!' },
  [UITranslationKeys.ALERT_SIGNUP_SUCCESS_PENDING_APPROVAL]: {
    [Language.EN]: 'Signup successful! Your account is pending administrator approval. You will be notified (simulated email) once active. You can try logging in later.',
    [Language.TE]: 'నమోదు విజయవంతమైంది! మీ ఖాతా నిర్వాహకుడి ఆమోదం కోసం పెండింగ్‌లో ఉంది. సక్రియం అయిన తర్వాత మీకు తెలియజేయబడుతుంది (అనుకరణ ఇమెయిల్). మీరు తర్వాత లాగిన్ చేయడానికి ప్రయత్నించవచ్చు.',
    [Language.TA]: 'பதிவு வெற்றிகரமாக முடிந்தது! உங்கள் கணக்கு நிர்வாகியின் ஒப்புதலுக்காக காத்திருக்கிறது. செயலில் வந்தவுடன் உங்களுக்கு அறிவிக்கப்படும் (போலி மின்னஞ்சல்). நீங்கள் பின்னர் உள்நுழைய முயற்சி செய்யலாம்.',
    [Language.KN]: 'ಸೈನ್ ಅಪ್ ಯಶಸ್ವಿಯಾಗಿದೆ! ನಿಮ್ಮ ಖಾತೆಯು ನಿರ್ವಾಹಕರ ಅನುಮೋದನೆಗಾಗಿ ಕಾಯುತ್ತಿದೆ. ಸಕ್ರಿಯಗೊಂಡ ನಂತರ ನಿಮಗೆ ತಿಳಿಸಲಾಗುವುದು (ಅನುಕರಿಸಿದ ಇಮೇಲ್). ನೀವು ನಂತರ ಲಾಗಿನ್ ಮಾಡಲು ಪ್ರಯತ್ನಿಸಬಹುದು.',
    [Language.HI]: 'साइनअप सफल! आपका खाता व्यवस्थापक अनुमोदन के लिए लंबित है। सक्रिय होने पर आपको सूचित किया जाएगा (नकली ईमेल)। आप बाद में लॉग इन करने का प्रयास कर सकते हैं।'
  },
  [UITranslationKeys.ALERT_USER_APPROVED_EMAIL_SIMULATION]: {
    [Language.EN]: "User '{userName}' approved with role {roleAssigned}. They can now log in. (Simulated: An email notification would be sent to {userEmail})",
    [Language.TE]: "'{userName}' వినియోగదారు {roleAssigned} పాత్రతో ఆమోదించబడ్డారు. వారు ఇప్పుడు లాగిన్ చేయవచ్చు. (అనుకరణ: {userEmail}కి ఇమెయిల్ నోటిఫికేషన్ పంపబడుతుంది)",
    [Language.TA]: "'{userName}' பயனர் {roleAssigned} பாத்திரத்துடன் அங்கீகரிக்கப்பட்டார். அவர்கள் இப்போது உள்நுழையலாம். (போலி: {userEmail}க்கு ஒரு மின்னஞ்சல் அறிவிப்பு அனுப்பப்படும்)",
    [Language.KN]: "'{userName}' ಬಳಕೆದಾರರನ್ನು {roleAssigned} ಪಾತ್ರದೊಂದಿಗೆ ಅನುಮೋದಿಸಲಾಗಿದೆ. ಅವರು ಈಗ ಲಾಗಿನ್ ಮಾಡಬಹುದು. (ಅನುಕರಿಸಲಾಗಿದೆ: {userEmail} ಗೆ ಇಮೇಲ್ ಅಧಿಸೂಚನೆಯನ್ನು ಕಳುಹಿಸಲಾಗುತ್ತದೆ)",
    [Language.HI]: "उपयोगकर्ता '{userName}' को भूमिका {roleAssigned} के साथ अनुमोदित किया गया। वे अब लॉग इन कर सकते हैं। (नकली: {userEmail} पर एक ईमेल सूचना भेजी जाएगी)"
  },


  // Customer Order Actions
  [UITranslationKeys.HTML_VIEW_ORDER_BUTTON]: { en: 'View HTML', te: 'HTML చూడండి', ta: 'HTML காண்க', kn: 'HTML ವೀಕ್ಷಿಸಿ', hi: 'एचटीएमएल देखें' },
  [UITranslationKeys.PRINT_ORDER_BUTTON]: { en: 'Print Order', te: 'ఆర్డర్‌ను ముద్రించండి', ta: 'ஆர்டரை அச்சிடு', kn: 'ಆರ್ಡರ್ ಮುದ್ರಿಸಿ', hi: 'आदेश प्रिंट करें' },
  [UITranslationKeys.ORDER_TOTAL_COST_LABEL]: {
    [Language.EN]: 'Total Order Cost: ₹{cost}',
    [Language.TE]: 'మొత్తం ఆర్డర్ ఖర్చు: ₹{cost}',
    [Language.TA]: 'மொத்த ஆர்டர் செலவு: ₹{cost}',
    [Language.KN]: 'ಒಟ್ಟು ಆರ್ಡರ್ ವೆಚ್ಚ: ₹{cost}',
    [Language.HI]: 'कुल ऑर्डर लागत: ₹{cost}'
  },
  [UITranslationKeys.SHARE_ORDER_WHATSAPP_BUTTON]: { 
    en: 'Share to WhatsApp', 
    te: 'WhatsApp లో షేర్ చేయండి', 
    ta: 'WhatsApp இல் பகிரவும்', 
    kn: 'WhatsApp ಗೆ ಹಂಚಿಕೊಳ್ಳಿ', 
    hi: 'व्हाट्सएप पर साझा करें' 
  },

  // Order Ingredient Editing
  [UITranslationKeys.EDIT_ORDER_INGREDIENT_TITLE]: { en: 'Edit Order Ingredient', te: 'ఆర్డర్ పదార్థాన్ని సవరించండి', ta: 'ஆர்டர் பொருளைத் திருத்து', kn: 'ಆರ್ಡರ್ ಪದಾರ್ಥವನ್ನು ಸಂಪಾದಿಸಿ', hi: 'ऑर्डर सामग्री संपादित करें' },
  [UITranslationKeys.ADD_ORDER_INGREDIENT_TITLE]: { en: 'Add Ingredient to Order', te: 'ఆర్డర్‌కు పదార్థాన్ని జోడించండి', ta: 'ஆர்டரில் பொருளைச் சேர்', kn: 'ಆರ್ಡರ್‌ಗೆ ಪದಾರ್ಥವನ್ನು ಸೇರಿಸಿ', hi: 'ऑर्डर में सामग्री जोड़ें' },
  [UITranslationKeys.ADD_INGREDIENT_TO_ORDER_BUTTON]: { en: 'Add Ingredient to Order', te: 'ఆర్డర్‌కు పదార్థాన్ని జోడించు', ta: 'ஆர்டரில் பொருளைச் சேர்', kn: 'ಆರ್ಡರ್‌ಗೆ ಪದಾರ್ಥವನ್ನು ಸೇರಿಸಿ', hi: 'ऑर्डर में सामग्री जोड़ें' },
  [UITranslationKeys.ORDER_INGREDIENT_NAME_LABEL]: { en: 'Ingredient Name', te: 'పదార్థం పేరు', ta: 'பொருள் பெயர்', kn: 'ಪದಾರ್ಥದ ಹೆಸರು', hi: 'सामग्री का नाम' },
  [UITranslationKeys.MASTER_INGREDIENT_LABEL]: { en: 'Master Ingredient', te: 'ప్రధాన పదార్థం', ta: 'முதன்மை பொருள்', kn: 'ಮುಖ್ಯ ಪದಾರ್ಥ', hi: 'मुख्य सामग्री' },
  [UITranslationKeys.SELECT_INGREDIENT_PLACEHOLDER]: { en: 'Select an ingredient...', te: 'ఒక పదార్థాన్ని ఎంచుకోండి...', ta: 'ஒரு பொருளைத் தேர்ந்தெடுக்கவும்...', kn: 'ಒಂದು ಪದಾರ್ಥವನ್ನು ಆಯ್ಕೆಮಾಡಿ...', hi: 'एक सामग्री चुनें...' },

  // Order Cooking Item Editing
  [UITranslationKeys.EDIT_ORDER_COOKING_ITEM_TITLE]: { en: 'Edit Order Cooking Item', te: 'ఆర్డర్ వంట సామాగ్రిని సవరించండి', ta: 'ஆர்டர் சமையல் பொருளைத் திருத்து', kn: 'ಆರ್ಡರ್ ಅಡುಗೆ ಸಾಮಾನು ಸಂಪಾದಿಸಿ', hi: 'ऑर्डर कुकिंग आइटम संपादित करें' },
  [UITranslationKeys.ADD_ORDER_COOKING_ITEM_TITLE]: { en: 'Add Cooking Item to Order', te: 'ఆర్డర్‌కు వంట సామాగ్రిని జోడించండి', ta: 'ஆர்டரில் சமையல் பொருளைச் சேர்', kn: 'ಆರ್ಡರ್‌ಗೆ ಅಡುಗೆ ಸಾಮಾನು ಸೇರಿಸಿ', hi: 'ऑर्डर में कुकिंग आइटम जोड़ें' },
  [UITranslationKeys.ADD_COOKING_ITEM_TO_ORDER_BUTTON]: { en: 'Add Cooking Item to Order', te: 'ఆర్డర్‌కు వంట సామాగ్రిని జోడించు', ta: 'ஆர்டரில் சமையல் பொருளைச் சேர்', kn: 'ಆರ್ಡರ್‌ಗೆ ಅಡುಗೆ ಸಾಮಾನು ಸೇರಿಸಿ', hi: 'ऑर्डर में कुकिंग आइटम जोड़ें' },
  [UITranslationKeys.ORDER_COOKING_ITEM_NAME_LABEL]: { en: 'Cooking Item Name', te: 'వంట సామాగ్రి పేరు', ta: 'சமையல் பொருள் பெயர்', kn: 'ಅಡುಗೆ ಸಾಮಾನು ಹೆಸರು', hi: 'कुकिंग आइटम का नाम' },
  [UITranslationKeys.MASTER_COOKING_ITEM_LABEL]: { en: 'Master Cooking Item', te: 'ప్రధాన వంట సామాగ్రి', ta: 'முதன்மை சமையல் பொருள்', kn: 'ಮುಖ್ಯ ಅಡುಗೆ ಸಾಮಾನು', hi: 'मुख्य कुकिंग आइटम' },
  [UITranslationKeys.SELECT_COOKING_ITEM_PLACEHOLDER]: { en: 'Select a cooking item...', te: 'ఒక వంట సామాగ్రిని ఎంచుకోండి...', ta: 'ஒரு சமையல் பொருளைத் தேர்ந்தெடுக்கவும்...', kn: 'ಒಂದು ಅಡುಗೆ ಸಾಮಾನು ಆಯ್ಕೆಮಾಡಿ...', hi: 'एक कुकिंग आइटम चुनें...' },
};

export const getUIText = (key: UITranslationKeys, preferredLang: Language, fallbackLang: Language = Language.EN, replacements?: {[key:string]: string|number}): string => {
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
      translatedString = translatedString!.replace(`{${placeholder}}`, String(replacements[placeholder]));
    });
  }
  return translatedString!;
};