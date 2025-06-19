import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { AuthUser, Ingredient, Dish, CookingItem, Customer, UserRole } from './types';
import { DEFAULT_SUPREM_USER, placeholderImage } from './constants';

const DB_NAME = 'CateringAppDB';
const DB_VERSION = 1;

interface CateringAppDBSchema extends DBSchema {
  users: {
    key: string;
    value: AuthUser;
    indexes: { username: string };
  };
  ingredients: {
    key: string;
    value: Ingredient;
  };
  dishes: {
    key: string;
    value: Dish;
  };
  cookingItems: {
    key: string;
    value: CookingItem;
  };
  customers: {
    key: string;
    value: Customer;
    indexes: { userId: string };
  };
}

let dbPromise: Promise<IDBPDatabase<CateringAppDBSchema>>;

const openAppDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<CateringAppDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('username', 'username', { unique: true });
        }
        if (!db.objectStoreNames.contains('ingredients')) {
          db.createObjectStore('ingredients', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('dishes')) {
          db.createObjectStore('dishes', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('cookingItems')) {
          db.createObjectStore('cookingItems', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('customers')) {
          const customerStore = db.createObjectStore('customers', { keyPath: 'id' });
          customerStore.createIndex('userId', 'userId');
        }
      },
    });
  }
  return dbPromise;
};


// User Operations
export const addUserDB = async (user: AuthUser) => (await openAppDB()).add('users', user);
export const getUserDB = async (id: string) => (await openAppDB()).get('users', id);
export const getUserByUsernameDB = async (username: string) => (await openAppDB()).getFromIndex('users', 'username', username);
export const getAllUsersDB = async () => (await openAppDB()).getAll('users');
export const putUserDB = async (user: AuthUser) => (await openAppDB()).put('users', user);
export const deleteUserDB = async (id: string) => (await openAppDB()).delete('users', id);

// Ingredient Operations
export const addIngredientDB = async (ingredient: Ingredient) => (await openAppDB()).add('ingredients', ingredient);
export const getIngredientDB = async (id: string) => (await openAppDB()).get('ingredients', id);
export const getAllIngredientsDB = async () => (await openAppDB()).getAll('ingredients');
export const putIngredientDB = async (ingredient: Ingredient) => (await openAppDB()).put('ingredients', ingredient);
export const deleteIngredientDB = async (id: string) => (await openAppDB()).delete('ingredients', id);

// Dish Operations
export const addDishDB = async (dish: Dish) => (await openAppDB()).add('dishes', dish);
export const getDishDB = async (id: string) => (await openAppDB()).get('dishes', id);
export const getAllDishesDB = async () => (await openAppDB()).getAll('dishes');
export const putDishDB = async (dish: Dish) => (await openAppDB()).put('dishes', dish);
export const deleteDishDB = async (id: string) => (await openAppDB()).delete('dishes', id);

// CookingItem Operations
export const addCookingItemDB = async (item: CookingItem) => (await openAppDB()).add('cookingItems', item);
export const getCookingItemDB = async (id: string) => (await openAppDB()).get('cookingItems', id);
export const getAllCookingItemsDB = async () => (await openAppDB()).getAll('cookingItems');
export const putCookingItemDB = async (item: CookingItem) => (await openAppDB()).put('cookingItems', item);
export const deleteCookingItemDB = async (id: string) => (await openAppDB()).delete('cookingItems', id);

// Customer Operations
export const addCustomerDB = async (customer: Customer) => (await openAppDB()).add('customers', customer);
export const getCustomerDB = async (id: string) => (await openAppDB()).get('customers', id);
export const getAllCustomersDB = async () => (await openAppDB()).getAll('customers');
export const getCustomersByUserIdDB = async (userId: string) => (await openAppDB()).getAllFromIndex('customers', 'userId', userId);
export const putCustomerDB = async (customer: Customer) => (await openAppDB()).put('customers', customer);
export const deleteCustomerDB = async (id: string) => (await openAppDB()).delete('customers', id);


export async function initializeDefaultData() {
    const db = await openAppDB();

    // Initialize Suprem User
    const usersCount = await db.count('users');
    if (usersCount === 0) {
        // Ensure the password field exists and is set for the default user
        const supremUserWithPassword = { ...DEFAULT_SUPREM_USER, password: DEFAULT_SUPREM_USER.password || 'password' };
        await db.add('users', supremUserWithPassword);
    } else {
        // Ensure Suprem user is up-to-date
        let supremUser = await db.get('users', DEFAULT_SUPREM_USER.id);
        if (supremUser) {
            let needsUpdate = false;
            if (supremUser.password !== (DEFAULT_SUPREM_USER.password || 'password')) {
                supremUser.password = DEFAULT_SUPREM_USER.password || 'password';
                needsUpdate = true;
            }
            if (supremUser.role !== UserRole.SUPREM) {
                supremUser.role = UserRole.SUPREM;
                needsUpdate = true;
            }
            if (!supremUser.isApproved) {
                supremUser.isApproved = true;
                needsUpdate = true;
            }
            if(supremUser.credits !== DEFAULT_SUPREM_USER.credits){
                supremUser.credits = DEFAULT_SUPREM_USER.credits;
                needsUpdate = true;
            }
            // Add other fields from DEFAULT_SUPREM_USER if they might change and need to be enforced
             for (const key of ['cateringName', 'phone', 'address', 'email', 'imageUrl', 'preferredLanguage'] as const) {
                if (supremUser[key] !== DEFAULT_SUPREM_USER[key]) {
                    (supremUser as any)[key] = DEFAULT_SUPREM_USER[key];
                    needsUpdate = true;
                }
            }

            if (needsUpdate) {
                await db.put('users', supremUser);
            }
        } else { // Suprem user missing for some reason
            const supremUserWithPassword = { ...DEFAULT_SUPREM_USER, password: DEFAULT_SUPREM_USER.password || 'password' };
            await db.add('users', supremUserWithPassword);
        }
    }


    // Initialize Ingredients
    const ingredientsCount = await db.count('ingredients');
    if (ingredientsCount === 0) {
        const defaultIngredients: Ingredient[] = [
            { id: 'ing1', name: { en: 'Salt', te: 'ఉప్పు', ta: 'உப்பு', kn: 'ಉಪ್ಪು', hi: 'नमक' }, imageUrl: placeholderImage(100,100,'salt'), quantity: 1000, unit: 'gram', price: 20 }, // e.g. Rs. 20 for 1000 grams
            { id: 'ing2', name: { en: 'Tomato', te: 'టమోటా', ta: 'தக்காளி', kn: 'ಟೊಮೆಟೊ', hi: 'टमाटर' }, imageUrl: placeholderImage(100,100,'tomato'), quantity: 1, unit: 'kg', price: 40 }, // e.g. Rs. 40 for 1 kg
            { id: 'ing3', name: { en: 'Onion', te: 'ఉల్లిపాయ', ta: 'வெங்காயம்', kn: 'ಈರುಳ್ಳಿ', hi: 'प्याज' }, imageUrl: placeholderImage(100,100,'onion'), quantity: 1, unit: 'kg', price: 30 }, // e.g. Rs. 30 for 1 kg
        ];
        for (const ing of defaultIngredients) {
            await db.add('ingredients', ing);
        }
    }

    // Initialize Dishes
    const dishesCount = await db.count('dishes');
    if (dishesCount === 0) {
        const defaultDishes: Dish[] = [
            {
                id: 'dish1',
                name: { en: 'Tomato Soup', te: 'టమోటా సూప్', hi: 'टमाटर का सूप' },
                imageUrl: placeholderImage(150,150,'soup'),
                ingredients: [{ ingredientId: 'ing2', quantity: 0.5 }, { ingredientId: 'ing1', quantity: 5}], // 0.5 kg tomato, 5 grams salt
                preparationSteps: {
                  en: "1. Sauté onions and garlic.\n2. Add chopped tomatoes and vegetable broth.\n3. Simmer for 20 minutes.\n4. Blend until smooth.\n5. Season with salt, pepper, and herbs.",
                  te: "1. ఉల్లిపాయలు మరియు వెల్లుల్లి వేయించాలి.\n2. తరిగిన టమోటాలు మరియు కూరగాయల రసం జోడించండి.\n3. 20 నిమిషాలు ఆవేశమును అణిచిపెట్టుకొను.\n4. మృదువైన వరకు కలపండి.\n5. ఉప్పు, మిరియాలు, మరియు మూలికలతో సీజన్.",
                  hi: "1. प्याज और लहसुन भूनें।\n2. कटे हुए टमाटर और सब्जी का शोरबा डालें।\n3. 20 मिनट तक उबालें।\n4. चिकना होने तक ब्लेंड करें।\n5. नमक, काली मिर्च और जड़ी बूटियों के साथ सीजन करें।"
                }
            },
        ];
        for (const dish of defaultDishes) {
            await db.add('dishes', dish);
        }
    }

    // Initialize Cooking Items
    const cookingItemsCount = await db.count('cookingItems');
    if (cookingItemsCount === 0) {
        const defaultCookingItems: CookingItem[] = [
            { id: 'ci1', name: { en: 'Large Pot', te: 'పెద్ద కుండ' }, summary: {en: 'A large pot for cooking for many.', te: 'చాలా మందికి వండడానికి పెద్ద కుండ.'}, imageUrl: placeholderImage(100,100,'pot'), unit: 'piece', price: 50 }, // e.g. Rs. 50 rental per piece
        ];
        for (const item of defaultCookingItems) {
            await db.add('cookingItems', item);
        }
    }
    // Customers are not initialized by default as they are user-created.
}
