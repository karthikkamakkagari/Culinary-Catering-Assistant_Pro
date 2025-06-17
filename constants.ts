import { Page, AuthUser, UserRole, Language, LanguageLabels } from './types';

export const APP_TITLE = "Culinary Catering Assistant";

// Default navigation items for logged-in users
export const baseNavigationItems = [
  { label: 'Home', page: Page.Home, roles: [UserRole.SUPREM, UserRole.ADMIN, UserRole.USER] },
  { label: 'Ingredients', page: Page.Ingredients, roles: [UserRole.SUPREM, UserRole.ADMIN] }, 
  { label: 'Dishes', page: Page.Dishes, roles: [UserRole.SUPREM, UserRole.ADMIN] },
  { label: 'Cooking Items', page: Page.CookingItems, roles: [UserRole.SUPREM, UserRole.ADMIN] }, 
  { label: 'Customers', page: Page.Customers, roles: [UserRole.SUPREM, UserRole.ADMIN, UserRole.USER] },
];

export const placeholderImage = (width: number, height: number, seed?: string) => `https://picsum.photos/seed/${seed || Math.random()}/${width}/${height}`;

export const DEFAULT_IMAGE_SIZE = 150;

export const DEFAULT_SUPREM_USER: AuthUser = {
  id: 'suprem_user_001',
  username: 'suprem',
  password: 'password', 
  cateringName: 'Master Caterers Inc.',
  phone: '000-000-0000',
  address: '123 Admin St, City',
  email: 'suprem@example.com', 
  credits: 99999, 
  role: UserRole.SUPREM,
  isApproved: true,
  imageUrl: placeholderImage(DEFAULT_IMAGE_SIZE,DEFAULT_IMAGE_SIZE, 'suprem'),
  preferredLanguage: Language.EN, // Added
};

export const SupportedLanguages = [Language.EN, Language.TE, Language.TA, Language.KN, Language.HI];

// Using LanguageLabels from types.ts is preferred if no difference, but for clarity if constants need their own version:
export const LanguageLabelMapping = LanguageLabels;

// For smart ingredient calculation
export const IngredientBaseUnits = {
  WEIGHT: 'gram',
  VOLUME: 'ml',
  PIECE: 'piece', // Discrete units
  LEAVES: 'leaves', // Discrete units
  TSP: 'tsp', // Can be volume, but sometimes treated as discrete for recipes
  TBSP: 'tbsp', // Same as tsp
  CUP: 'cup',   // Same as tsp
  // Add other discrete units if needed
};

export const UnitConversionFactors: { [unit: string]: { toBase: number; baseUnit: string } } = {
  'kg': { toBase: 1000, baseUnit: IngredientBaseUnits.WEIGHT },
  'gram': { toBase: 1, baseUnit: IngredientBaseUnits.WEIGHT },
  'liters': { toBase: 1000, baseUnit: IngredientBaseUnits.VOLUME },
  'ml': { toBase: 1, baseUnit: IngredientBaseUnits.VOLUME },
  'piece': { toBase: 1, baseUnit: IngredientBaseUnits.PIECE },
  'leaves': { toBase: 1, baseUnit: IngredientBaseUnits.LEAVES },
  'tsp': { toBase: 5, baseUnit: IngredientBaseUnits.VOLUME }, // Approximate to ml for calculation, or treat as discrete if preferred. Let's use ml for now.
  'tbsp': { toBase: 15, baseUnit: IngredientBaseUnits.VOLUME }, // Approx 3 tsp
  'cup': { toBase: 240, baseUnit: IngredientBaseUnits.VOLUME }, // Approx 16 tbsp
  // Note: For tsp, tbsp, cup, if they are used for dry ingredients like flour/sugar, their weight conversion varies.
  // For simplicity here, we treat them as volume or let them pass as discrete if not convertible.
  // The current `convertToBaseUnit` will pass them if not in this map or handle as volume for tsp/tbsp/cup.
};