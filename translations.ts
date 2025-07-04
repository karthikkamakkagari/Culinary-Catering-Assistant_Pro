
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
  password_hash?: string; 
  catering_name: string;
  image_url?: string;
  phone: string;
  address: string;
  email: string; 
  credits: number; 
  role: UserRole;
  is_approved: boolean;
  preferred_language: Language; 
}

export interface Ingredient {
  id: string;
  image_url: string;
  quantity: number;
  unit: string;
  price: number;
  name_en?: string;
  name_te?: string;
  name_ta?: string;
  name_kn?: string;
  name_hi?: string;
}

export interface DishIngredient {
  ingredientId: string;
  quantity: number; 
}

export interface Dish {
  id: string;
  name_localized: LocalizedText; // Updated
  image_url: string; // Updated
  ingredients: DishIngredient[];
  preparation_steps_localized: LocalizedText; // Updated
}

export interface CookingItem {
  id: string;
  name_localized: LocalizedText; // Updated
  image_url: string; // Updated
  summary_localized: LocalizedText; // Updated
  unit: string;
  price: number; 
}

export interface CustomerDishSelection {
  dishId: string;
}

export interface CustomerCookingItemSelection {
  cookingItemId: string;
  quantity: number;
}

export interface CumulativeIngredient {
  id: string; 
  masterIngredientId: string; 
  name: string; // This will be the translated name for display
  totalQuantity: number;
  unit: string;
  totalPrice: number; 
}

export interface SelectedCookingItemDetail {
    id: string; 
    masterCookingItemId: string; 
    name: string; // This will be the translated name for display
    quantity: number;
    unit: string;
    price: number; 
    totalPrice: number; 
}

export interface GeneratedOrder {
  cumulativeIngredients: CumulativeIngredient[];
  selectedCookingItems: SelectedCookingItemDetail[]; 
  totalOrderCost: number; 
}

export interface Customer {
  id:string;
  name: string; 
  image_url: string; // Updated
  phone: string;
  address: string;
  number_of_persons: number; // Updated
  selectedDishes: CustomerDishSelection[];
  selectedCookingItems: CustomerCookingItemSelection[];
  generated_order_details?: GeneratedOrder | null; // Updated
  userId?: string; 
  email?: string; 
  credits?: number; 
  newPassword?: string; 
  catering_name?: string; 
}

// Base fields for a customer record, excluding relational/UI-specific data
export type CustomerBase = Pick<Customer,
  'id' |
  'name' |
  'image_url' | // Updated
  'phone' |
  'address' |
  'number_of_persons' | // Updated
  'userId'
>;

// Represents the full record in the NocoDB 'Customers' table
export type CustomerTableRecord = CustomerBase & {
  generated_order_details?: GeneratedOrder | null; // Updated: This is a JSON field on the main table
};

// Payload for creating a new customer record.
// 'id' is client-generated. 'generated_order_details' is typically not set at creation.
export type CustomerTableCreatePayload = CustomerBase;

// Payload for updating an existing customer record.
// 'id' is in the URL. Any field from CustomerTableRecord (like generated_order_details) can be updated.
export type CustomerTableUpdatePayload = Partial<Omit<CustomerTableRecord, 'id'>>;


export const IngredientUnits: string[] = ['kg', 'gram', 'piece', 'leaves', 'liters', 'ml', 'tsp', 'tbsp', 'cup'];
export const CookingItemUnits: string[] = ['kg', 'gram', 'piece', 'Big one', 'Small one', 'Medium one', 'pack', 'bottle'];

export type ModalType = 'ingredient' | 'dish' | 'cookingItem' | 'customer' | 'profile' | 'orderIngredient' | 'orderCookingItem' | null;

// Enum for UI Translation Keys
export enum UITranslationKeys {
  // General
  ADD_NEW = 'ADD_NEW',
  SAVE_CHANGES = 'SAVE_CHANGES',
  CANCEL = 'CANCEL',
  SEARCH_PLACEHOLDER = 'SEARCH_PLACEHOLDER',
  NAME_LABEL = 'NAME_LABEL',
  IMAGE_LABEL = 'IMAGE_LABEL',
  PRICE_LABEL = 'PRICE_LABEL', 
  COST_LABEL = 'COST_LABEL', 
  TOTAL_COST_LABEL = 'TOTAL_COST_LABEL', 
  // Ingredients
  INGREDIENTS_PAGE_TITLE = 'INGREDIENTS_PAGE_TITLE',
  ADD_INGREDIENT_TITLE = 'ADD_INGREDIENT_TITLE',
  EDIT_INGREDIENT_TITLE = 'EDIT_INGREDIENT_TITLE',
  INGREDIENT_NAME_LABEL = 'INGREDIENT_NAME_LABEL',
  QUANTITY_LABEL = 'QUANTITY_LABEL',
  UNIT_LABEL = 'UNIT_LABEL',
  INGREDIENT_PRICE_FOR_QTY_UNIT_LABEL = 'INGREDIENT_PRICE_FOR_QTY_UNIT_LABEL', 
  // Dishes
  DISHES_PAGE_TITLE = 'DISHES_PAGE_TITLE', 
  ADD_DISH_TITLE = 'ADD_DISH_TITLE', 
  EDIT_DISH_TITLE = 'EDIT_DISH_TITLE', 
  DISH_NAME_LABEL = 'DISH_NAME_LABEL', 
  PREPARATION_STEPS_LABEL = 'PREPARATION_STEPS_LABEL', 
  SELECT_INGREDIENTS_LABEL = 'SELECT_INGREDIENTS_LABEL', 
  NO_INGREDIENTS_AVAILABLE = 'NO_INGREDIENTS_AVAILABLE', 
  DISH_COST_LABEL = 'DISH_COST_LABEL', 
  // Cooking Items
  COOKING_ITEMS_PAGE_TITLE = 'COOKING_ITEMS_PAGE_TITLE',
  ADD_COOKING_ITEM_TITLE = 'ADD_COOKING_ITEM_TITLE',
  EDIT_COOKING_ITEM_TITLE = 'EDIT_COOKING_ITEM_TITLE',
  COOKING_ITEM_NAME_LABEL = 'COOKING_ITEM_NAME_LABEL',
  SUMMARY_LABEL = 'SUMMARY_LABEL',
  COOKING_ITEM_PRICE_PER_UNIT_LABEL = 'COOKING_ITEM_PRICE_PER_UNIT_LABEL', 

  // PDF Labels
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
  PDF_INGREDIENTS_TABLE_HEADER_PRICE = 'PDF_INGREDIENTS_TABLE_HEADER_PRICE', 
  PDF_NO_INGREDIENTS_CALCULATED = 'PDF_NO_INGREDIENTS_CALCULATED',
  PDF_SELECTED_COOKING_ITEMS_TITLE = 'PDF_SELECTED_COOKING_ITEMS_TITLE',
  PDF_COOKING_ITEMS_TABLE_HEADER_NAME = 'PDF_COOKING_ITEMS_TABLE_HEADER_NAME',
  PDF_COOKING_ITEMS_TABLE_HEADER_QUANTITY = 'PDF_COOKING_ITEMS_TABLE_HEADER_QUANTITY',
  PDF_COOKING_ITEMS_TABLE_HEADER_UNIT = 'PDF_COOKING_ITEMS_TABLE_HEADER_UNIT',
  PDF_COOKING_ITEMS_TABLE_HEADER_PRICE_PER_UNIT = 'PDF_COOKING_ITEMS_TABLE_HEADER_PRICE_PER_UNIT', 
  PDF_COOKING_ITEMS_TABLE_HEADER_TOTAL_PRICE = 'PDF_COOKING_ITEMS_TABLE_HEADER_TOTAL_PRICE', 
  PDF_NO_COOKING_ITEMS_SELECTED = 'PDF_NO_COOKING_ITEMS_SELECTED',
  PDF_TOTAL_ORDER_COST_LABEL = 'PDF_TOTAL_ORDER_COST_LABEL', 
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
  EXCEL_EXPORT_DISHES_BUTTON = 'EXCEL_EXPORT_DISHES_BUTTON', 
  EXCEL_IMPORT_DISHES_BUTTON = 'EXCEL_IMPORT_DISHES_BUTTON', 
  ALERT_DISHES_EXPORTED_SUCCESS = 'ALERT_DISHES_EXPORTED_SUCCESS', 
  ALERT_DISHES_IMPORTED_SUCCESS = 'ALERT_DISHES_IMPORTED_SUCCESS', 
  EXCEL_DISH_IMPORT_INVALID_INGREDIENT_ID = 'EXCEL_DISH_IMPORT_INVALID_INGREDIENT_ID', 
  EXCEL_DISH_IMPORT_INVALID_INGREDIENT_QUANTITY = 'EXCEL_DISH_IMPORT_INVALID_INGREDIENT_QUANTITY', 
  EXCEL_DISH_IMPORT_INVALID_INGREDIENTS_JSON = 'EXCEL_DISH_IMPORT_INVALID_INGREDIENTS_JSON', 
  EXCEL_EXPORT_COOKING_ITEMS_BUTTON = 'EXCEL_EXPORT_COOKING_ITEMS_BUTTON',
  EXCEL_IMPORT_COOKING_ITEMS_BUTTON = 'EXCEL_IMPORT_COOKING_ITEMS_BUTTON',
  ALERT_COOKING_ITEMS_EXPORTED_SUCCESS = 'ALERT_COOKING_ITEMS_EXPORTED_SUCCESS',
  ALERT_COOKING_ITEMS_IMPORTED_SUCCESS = 'ALERT_COOKING_ITEMS_IMPORTED_SUCCESS',


  // General Alerts
  ALERT_PERMISSION_DENIED = 'ALERT_PERMISSION_DENIED',
  ALERT_INGREDIENTS_EXPORTED_SUCCESS = 'ALERT_INGREDIENTS_EXPORTED_SUCCESS',
  ALERT_SIGNUP_SUCCESS_PENDING_APPROVAL = 'ALERT_SIGNUP_SUCCESS_PENDING_APPROVAL', 
  ALERT_USER_APPROVED_EMAIL_SIMULATION = 'ALERT_USER_APPROVED_EMAIL_SIMULATION',
  ALERT_USERNAME_RESERVED = 'ALERT_USERNAME_RESERVED',
  ALERT_USERNAME_TAKEN = 'ALERT_USERNAME_TAKEN',

  // Customer Order Actions
  HTML_VIEW_ORDER_BUTTON = 'HTML_VIEW_ORDER_BUTTON',
  PRINT_ORDER_BUTTON = 'PRINT_ORDER_BUTTON',
  ORDER_TOTAL_COST_LABEL = 'ORDER_TOTAL_COST_LABEL', 
  SHARE_ORDER_WHATSAPP_BUTTON = 'SHARE_ORDER_WHATSAPP_BUTTON', // Added


  // Order Ingredient Editing
  EDIT_ORDER_INGREDIENT_TITLE = 'EDIT_ORDER_INGREDIENT_TITLE',
  ADD_ORDER_INGREDIENT_TITLE = 'ADD_ORDER_INGREDIENT_TITLE',
  ADD_INGREDIENT_TO_ORDER_BUTTON = 'ADD_INGREDIENT_TO_ORDER_BUTTON',
  ORDER_INGREDIENT_NAME_LABEL = 'ORDER_INGREDIENT_NAME_LABEL',
  MASTER_INGREDIENT_LABEL = 'MASTER_INGREDIENT_LABEL',
  SELECT_INGREDIENT_PLACEHOLDER = 'SELECT_INGREDIENT_PLACEHOLDER',

  // Order Cooking Item Editing
  EDIT_ORDER_COOKING_ITEM_TITLE = 'EDIT_ORDER_COOKING_ITEM_TITLE',
  ADD_ORDER_COOKING_ITEM_TITLE = 'ADD_ORDER_COOKING_ITEM_TITLE',
  ADD_COOKING_ITEM_TO_ORDER_BUTTON = 'ADD_COOKING_ITEM_TO_ORDER_BUTTON',
  ORDER_COOKING_ITEM_NAME_LABEL = 'ORDER_COOKING_ITEM_NAME_LABEL',
  MASTER_COOKING_ITEM_LABEL = 'MASTER_COOKING_ITEM_LABEL',
  SELECT_COOKING_ITEM_PLACEHOLDER = 'SELECT_COOKING_ITEM_PLACEHOLDER',
}
