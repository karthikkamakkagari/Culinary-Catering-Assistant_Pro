export enum Page {
  PublicHome = 'PUBLIC_HOME', // New public landing page
  Login = 'LOGIN',
  Signup = 'SIGNUP',
  Home = 'HOME',
  Ingredients = 'INGREDIENTS',
  Dishes = 'DISHES',
  CookingItems = 'COOKING_ITEMS',
  Customers = 'CUSTOMERS',
  UserManagement = 'USER_MANAGEMENT', // For Suprem
  Profile = 'PROFILE', // For users to edit their own info
  UserDetailsView = 'USER_DETAILS_VIEW', // For Suprem to view details of a specific user
}

export enum UserRole {
  SUPREM = 'SUPREM',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum Language {
  EN = 'en',
  TE = 'te', // Telugu
  TA = 'ta', // Tamil
  KN = 'kn', // Kannada
  HI = 'hi', // Hindi
}

export const LanguageLabels: { [key in Language]: string } = {
  [Language.EN]: 'English',
  [Language.TE]: 'Telugu (తెలుగు)',
  [Language.TA]: 'Tamil (தமிழ்)',
  [Language.KN]: 'Kannada (ಕನ್ನಡ)',
  [Language.HI]: 'Hindi (हिन्दी)',
};

export type LocalizedText = {
  [key in Language]?: string;
};

export interface AuthUser {
  id: string;
  username: string;
  password?: string; 
  cateringName: string;
  imageUrl?: string;
  phone: string;
  address: string;
  email: string; 
  credits: number; 
  role: UserRole;
  isApproved: boolean;
  preferredLanguage: Language; // Added
}

export interface Ingredient {
  id: string;
  name: LocalizedText; // Changed
  imageUrl: string;
  quantity: number; 
  unit: string;
}

export interface DishIngredient {
  ingredientId: string;
  quantity: number; 
}

export interface Dish {
  id: string;
  name: LocalizedText; // Changed
  imageUrl: string;
  ingredients: DishIngredient[];
  preparationSteps: LocalizedText; // Added
}

export interface CookingItem {
  id: string;
  name: LocalizedText; // Changed
  imageUrl: string;
  summary: LocalizedText; // Changed
  unit: string;
}

export interface CustomerDishSelection {
  dishId: string;
}

export interface CustomerCookingItemSelection {
  cookingItemId: string;
  quantity: number;
}

export interface CumulativeIngredient {
  name: string; // This will be translated at point of generation
  totalQuantity: number;
  unit: string;
}

export interface GeneratedOrder {
  cumulativeIngredients: CumulativeIngredient[];
  selectedCookingItems: Array<{ name: string; quantity: number; unit: string }>; // This will be translated
}

export interface Customer {
  id:string;
  name: string; // Customer name is user input, not typically localized in this context
  imageUrl: string;
  phone: string;
  address: string;
  numberOfPersons: number;
  selectedDishes: CustomerDishSelection[];
  selectedCookingItems: CustomerCookingItemSelection[];
  generatedOrder?: GeneratedOrder | null;
  userId?: string; 
  email?: string; 
  credits?: number; 
  newPassword?: string; 
}

export const IngredientUnits: string[] = ['kg', 'gram', 'piece', 'leaves', 'liters', 'ml', 'tsp', 'tbsp', 'cup'];
export const CookingItemUnits: string[] = ['kg', 'gram', 'piece', 'Big one', 'Small one', 'Medium one', 'pack', 'bottle'];

export type ModalType = 'ingredient' | 'dish' | 'cookingItem' | 'customer' | 'profile' | null;

// Enum for UI Translation Keys
export enum UITranslationKeys {
  // General
  ADD_NEW = 'ADD_NEW',
  SAVE_CHANGES = 'SAVE_CHANGES',
  CANCEL = 'CANCEL',
  SEARCH_PLACEHOLDER = 'SEARCH_PLACEHOLDER',
  NAME_LABEL = 'NAME_LABEL',
  IMAGE_LABEL = 'IMAGE_LABEL',
  // Ingredients
  INGREDIENTS_PAGE_TITLE = 'INGREDIENTS_PAGE_TITLE',
  ADD_INGREDIENT_TITLE = 'ADD_INGREDIENT_TITLE',
  EDIT_INGREDIENT_TITLE = 'EDIT_INGREDIENT_TITLE',
  INGREDIENT_NAME_LABEL = 'INGREDIENT_NAME_LABEL',
  QUANTITY_LABEL = 'QUANTITY_LABEL',
  UNIT_LABEL = 'UNIT_LABEL',
  // Cooking Items
  COOKING_ITEMS_PAGE_TITLE = 'COOKING_ITEMS_PAGE_TITLE',
  ADD_COOKING_ITEM_TITLE = 'ADD_COOKING_ITEM_TITLE',
  EDIT_COOKING_ITEM_TITLE = 'EDIT_COOKING_ITEM_TITLE',
  COOKING_ITEM_NAME_LABEL = 'COOKING_ITEM_NAME_LABEL',
  SUMMARY_LABEL = 'SUMMARY_LABEL',

  // PDF Labels (retained for PDF generation)
  PDF_ORDER_SUMMARY_TITLE = 'PDF_ORDER_SUMMARY_TITLE',
  PDF_GENERATED_ON_LABEL = 'PDF_GENERATED_ON_LABEL',
  PDF_CUSTOMER_LABEL = 'PDF_CUSTOMER_LABEL',
  PDF_CUSTOMER_PHONE_LABEL = 'PDF_CUSTOMER_PHONE_LABEL',
  PDF_CUSTOMER_ADDRESS_LABEL = 'PDF_CUSTOMER_ADDRESS_LABEL',
  PDF_NUM_PERSONS_LABEL = 'PDF_NUM_PERSONS_LABEL',
  PDF_SELECTED_DISHES_TITLE = 'PDF_SELECTED_DISHES_TITLE',
  PDF_NO_DISHES_SELECTED = 'PDF_NO_DISHES_SELECTED',
  PDF_REQUIRED_INGREDIENTS_TITLE = 'PDF_REQUIRED_INGREDIENTS_TITLE',
  PDF_INGREDIENTS_TABLE_HEADER_NAME = 'PDF_INGREDIENTS_TABLE_HEADER_NAME',
  PDF_INGREDIENTS_TABLE_HEADER_QUANTITY = 'PDF_INGREDIENTS_TABLE_HEADER_QUANTITY',
  PDF_INGREDIENTS_TABLE_HEADER_UNIT = 'PDF_INGREDIENTS_TABLE_HEADER_UNIT',
  PDF_NO_INGREDIENTS_CALCULATED = 'PDF_NO_INGREDIENTS_CALCULATED',
  PDF_SELECTED_COOKING_ITEMS_TITLE = 'PDF_SELECTED_COOKING_ITEMS_TITLE',
  PDF_COOKING_ITEMS_TABLE_HEADER_NAME = 'PDF_COOKING_ITEMS_TABLE_HEADER_NAME',
  PDF_COOKING_ITEMS_TABLE_HEADER_QUANTITY = 'PDF_COOKING_ITEMS_TABLE_HEADER_QUANTITY',
  PDF_COOKING_ITEMS_TABLE_HEADER_UNIT = 'PDF_COOKING_ITEMS_TABLE_HEADER_UNIT',
  PDF_NO_COOKING_ITEMS_SELECTED = 'PDF_NO_COOKING_ITEMS_SELECTED',
  PDF_THANK_YOU_MESSAGE = 'PDF_THANK_YOU_MESSAGE',
  PDF_PREPARED_BY_LABEL = 'PDF_PREPARED_BY_LABEL',
  PDF_USER_PHONE_LABEL = 'PDF_USER_PHONE_LABEL',
  PDF_USER_ADDRESS_LABEL = 'PDF_USER_ADDRESS_LABEL',
  PDF_USER_CATERING_NAME_LABEL = 'PDF_USER_CATERING_NAME_LABEL',
  PDF_USER_LOGO_ALT = 'PDF_USER_LOGO_ALT',
  PDF_PAGE_LABEL = 'PDF_PAGE_LABEL',
  PDF_OF_LABEL = 'PDF_OF_LABEL',

  // Excel related
  EXCEL_EXPORT_INGREDIENTS_BUTTON = 'EXCEL_EXPORT_INGREDIENTS_BUTTON',
  EXCEL_IMPORT_INGREDIENTS_BUTTON = 'EXCEL_IMPORT_INGREDIENTS_BUTTON',
  EXCEL_IMPORT_SUCCESS_ALERT = 'EXCEL_IMPORT_SUCCESS_ALERT',
  EXCEL_IMPORT_FAILURE_ALERT = 'EXCEL_IMPORT_FAILURE_ALERT',
  EXCEL_INVALID_FILE_FORMAT_ALERT = 'EXCEL_INVALID_FILE_FORMAT_ALERT',
  EXCEL_NO_FILE_SELECTED_ALERT = 'EXCEL_NO_FILE_SELECTED_ALERT',
  EXCEL_HEADER_MISMATCH_ALERT = 'EXCEL_HEADER_MISMATCH_ALERT',

  // General Alerts
  ALERT_PERMISSION_DENIED = 'ALERT_PERMISSION_DENIED',
  ALERT_INGREDIENTS_EXPORTED_SUCCESS = 'ALERT_INGREDIENTS_EXPORTED_SUCCESS',

  // Customer Order Actions
  HTML_VIEW_ORDER_BUTTON = 'HTML_VIEW_ORDER_BUTTON',
  PRINT_ORDER_BUTTON = 'PRINT_ORDER_BUTTON',
}