
// src/data.service.ts
import { AuthUser, Ingredient, Dish, CookingItem, Customer, CustomerDishSelection, CustomerCookingItemSelection, GeneratedOrder } from '../types'; // Corrected path
import { 
    USERS_TABLE_PATH, 
    INGREDIENTS_TABLE_PATH, 
    DISHES_TABLE_PATH, 
    COOKING_ITEMS_TABLE_PATH, 
    CUSTOMERS_TABLE_PATH,
    CUSTOMER_SELECTED_DISHES_TABLE_PATH,
    CUSTOMER_SELECTED_COOKING_ITEMS_TABLE_PATH
} from './apiConstants'; 
import { getList, getById, create, update, remove, bulkUpdate, bulkRemove, linkRecords, unlinkRecords } from './apiService';

// User Operations
export const addUserAPI = async (user: Omit<AuthUser, 'id'>): Promise<AuthUser> => create<AuthUser>(USERS_TABLE_PATH, user);
export const getUserAPI = async (id: string): Promise<AuthUser | undefined> => {
    try {
        return await getById<AuthUser>(USERS_TABLE_PATH, id);
    } catch (error: any) {
        if (error.status === 404) return undefined;
        throw error;
    }
};

export const getUserByUsernameAPI = async (username: string): Promise<AuthUser | undefined> => {
    // NocoDB filtering uses query parameters. Example: where=(username,eq,target_username)
    // The exact query parameter might differ based on NocoDB version and setup.
    // Consult NocoDB API documentation for precise filtering syntax.
    // This is a common way:
    const params = {
        where: `(username,eq,${username})`
    };
    const users = await getList<AuthUser>(USERS_TABLE_PATH, params);
    return users.length > 0 ? users[0] : undefined;
};
export const getAllUsersAPI = async (): Promise<AuthUser[]> => getList<AuthUser>(USERS_TABLE_PATH);
export const updateUserAPI = async (id: string, user: Partial<AuthUser>): Promise<AuthUser> => update<AuthUser>(USERS_TABLE_PATH, id, user);
export const deleteUserAPI = async (id: string): Promise<void> => remove(USERS_TABLE_PATH, id);


// Ingredient Operations
export const addIngredientAPI = async (ingredient: Omit<Ingredient, 'id'>): Promise<Ingredient> => create<Ingredient>(INGREDIENTS_TABLE_PATH, ingredient);
export const getIngredientAPI = async (id: string): Promise<Ingredient | undefined> => {
     try {
        return await getById<Ingredient>(INGREDIENTS_TABLE_PATH, id);
    } catch (error: any) {
        if (error.status === 404) return undefined;
        throw error;
    }
};
export const getAllIngredientsAPI = async (): Promise<Ingredient[]> => getList<Ingredient>(INGREDIENTS_TABLE_PATH);
export const updateIngredientAPI = async (id: string, ingredient: Partial<Ingredient>): Promise<Ingredient> => update<Ingredient>(INGREDIENTS_TABLE_PATH, id, ingredient);
export const deleteIngredientAPI = async (id: string): Promise<void> => remove(INGREDIENTS_TABLE_PATH, id);

// Dish Operations
export const addDishAPI = async (dish: Omit<Dish, 'id'>): Promise<Dish> => create<Dish>(DISHES_TABLE_PATH, dish);
export const getDishAPI = async (id: string): Promise<Dish | undefined> => {
    try {
        return await getById<Dish>(DISHES_TABLE_PATH, id);
    } catch (error: any) {
        if (error.status === 404) return undefined;
        throw error;
    }
};
export const getAllDishesAPI = async (): Promise<Dish[]> => getList<Dish>(DISHES_TABLE_PATH);
export const updateDishAPI = async (id: string, dish: Partial<Dish>): Promise<Dish> => update<Dish>(DISHES_TABLE_PATH, id, dish);
export const deleteDishAPI = async (id: string): Promise<void> => remove(DISHES_TABLE_PATH, id);

// CookingItem Operations
export const addCookingItemAPI = async (item: Omit<CookingItem, 'id'>): Promise<CookingItem> => create<CookingItem>(COOKING_ITEMS_TABLE_PATH, item);
export const getCookingItemAPI = async (id: string): Promise<CookingItem | undefined> => {
    try {
        return await getById<CookingItem>(COOKING_ITEMS_TABLE_PATH, id);
    } catch (error: any) {
        if (error.status === 404) return undefined;
        throw error;
    }
};
export const getAllCookingItemsAPI = async (): Promise<CookingItem[]> => getList<CookingItem>(COOKING_ITEMS_TABLE_PATH);
export const updateCookingItemAPI = async (id: string, item: Partial<CookingItem>): Promise<CookingItem> => update<CookingItem>(COOKING_ITEMS_TABLE_PATH, id, item);
export const deleteCookingItemAPI = async (id: string): Promise<void> => remove(COOKING_ITEMS_TABLE_PATH, id);

// Customer Operations
export const addCustomerAPI = async (customer: Omit<Customer, 'id' | 'generatedOrder'> & { generatedOrder?: GeneratedOrder | null }): Promise<Customer> => create<Customer>(CUSTOMERS_TABLE_PATH, customer);
export const getCustomerAPI = async (id: string): Promise<Customer | undefined> => {
    try {
        return await getById<Customer>(CUSTOMERS_TABLE_PATH, id);
    } catch (error: any) {
        if (error.status === 404) return undefined;
        throw error;
    }
};
export const getAllCustomersAPI = async (): Promise<Customer[]> => getList<Customer>(CUSTOMERS_TABLE_PATH);
export const getCustomersByUserIdAPI = async (userId: string): Promise<Customer[]> => {
    const params = { where: `(userId,eq,${userId})` }; // NocoDB filter
    return getList<Customer>(CUSTOMERS_TABLE_PATH, params);
};
export const updateCustomerAPI = async (id: string, customer: Partial<Customer>): Promise<Customer> => update<Customer>(CUSTOMERS_TABLE_PATH, id, customer);
export const deleteCustomerAPI = async (id: string): Promise<void> => remove(CUSTOMERS_TABLE_PATH, id);


// --- Join Table Operations ---

// CustomerSelectedDish (represents an entry in the join table)
// NocoDB might return the fields with underscores, ensure your types match or transform
export interface CustomerSelectedDishRecord {
  id: string; // ID of the join table record itself
  customer_id: string; // Foreign key to Customer
  dish_id: string;     // Foreign key to Dish
  // Add any other fields specific to the relationship, if any (e.g., created_at from BaaS)
  // NocoDB typically adds `nc_created_at`, `nc_updated_at`, `nc_order_id` etc.
}
export const getCustomerSelectedDishesAPI = async (customerId: string): Promise<CustomerSelectedDishRecord[]> => {
    const params = { where: `(customer_id,eq,${customerId})` }; // NocoDB filter
    return getList<CustomerSelectedDishRecord>(CUSTOMER_SELECTED_DISHES_TABLE_PATH, params);
};
export const addCustomerSelectedDishAPI = async (selection: { customer_id: string; dish_id: string }): Promise<CustomerSelectedDishRecord> => {
    return create<CustomerSelectedDishRecord>(CUSTOMER_SELECTED_DISHES_TABLE_PATH, selection);
};
export const deleteCustomerSelectedDishAPI = async (joinRecordId: string): Promise<void> => {
    return remove(CUSTOMER_SELECTED_DISHES_TABLE_PATH, joinRecordId);
};


// CustomerSelectedCookingItem (represents an entry in the join table)
export interface CustomerSelectedCookingItemRecord {
  id: string; // ID of the join table record itself
  customer_id: string;    // Foreign key to Customer
  cooking_item_id: string; // Foreign key to CookingItem
  quantity: number;
}
export const getCustomerSelectedCookingItemsAPI = async (customerId: string): Promise<CustomerSelectedCookingItemRecord[]> => {
    const params = { where: `(customer_id,eq,${customerId})` }; // NocoDB filter
    return getList<CustomerSelectedCookingItemRecord>(CUSTOMER_SELECTED_COOKING_ITEMS_TABLE_PATH, params);
};
export const addCustomerSelectedCookingItemAPI = async (selection: { customer_id: string; cooking_item_id: string; quantity: number }): Promise<CustomerSelectedCookingItemRecord> => {
    return create<CustomerSelectedCookingItemRecord>(CUSTOMER_SELECTED_COOKING_ITEMS_TABLE_PATH, selection);
};
export const updateCustomerSelectedCookingItemAPI = async (joinRecordId: string, data: { quantity: number }): Promise<CustomerSelectedCookingItemRecord> => {
    return update<CustomerSelectedCookingItemRecord>(CUSTOMER_SELECTED_COOKING_ITEMS_TABLE_PATH, joinRecordId, data);
};
export const deleteCustomerSelectedCookingItemAPI = async (joinRecordId: string): Promise<void> => {
    return remove(CUSTOMER_SELECTED_COOKING_ITEMS_TABLE_PATH, joinRecordId);
};
