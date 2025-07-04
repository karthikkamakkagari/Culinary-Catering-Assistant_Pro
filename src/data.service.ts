
// src/data.service.ts
import { AuthUser, Ingredient, Dish, CookingItem, Customer, CustomerTableCreatePayload, CustomerTableUpdatePayload, GeneratedOrder } from '../types.ts';
import { 
    USERS_TABLE_PATH, USERS_VIEW_ID,
    INGREDIENTS_TABLE_PATH, INGREDIENTS_VIEW_ID,
    DISHES_TABLE_PATH, DISHES_VIEW_ID,
    COOKING_ITEMS_TABLE_PATH, COOKING_ITEMS_VIEW_ID,
    CUSTOMERS_TABLE_PATH, CUSTOMERS_VIEW_ID,
    CUSTOMER_SELECTED_DISHES_TABLE_PATH, CUSTOMER_SELECTED_DISHES_VIEW_ID,
    CUSTOMER_SELECTED_COOKING_ITEMS_TABLE_PATH, CUSTOMER_SELECTED_COOKING_ITEMS_VIEW_ID
} from './apiConstants.ts'; 
import { getList, create, update, remove } from './apiService.ts';

// User Operations
export const addUserAPI = async (user: Omit<AuthUser, 'id'> & { id?: string }): Promise<AuthUser> => create<AuthUser>(USERS_TABLE_PATH, user); 
export const getUserAPI = async (id: string): Promise<AuthUser | undefined> => {
    const params: Record<string, any> = { where: `(id,eq,${id})`, limit: 1 };
    if (USERS_VIEW_ID) params.viewId = USERS_VIEW_ID;
    const users = await getList<AuthUser>(USERS_TABLE_PATH, params);
    return users.length > 0 ? users[0] : undefined;
};

export const getUserByUsernameAPI = async (username: string): Promise<AuthUser | undefined> => {
    console.log(`data.service.ts: getUserByUsernameAPI called for username: '${username}'`);
    const params: Record<string, any> = { 
        where: `(username,eq,${username})`,
        limit: 1, 
        offset: 0
    };
    if (USERS_VIEW_ID) {
        params.viewId = USERS_VIEW_ID;
    }
    console.log("data.service.ts: getUserByUsernameAPI - Params for search:", params);
    const users = await getList<AuthUser>(USERS_TABLE_PATH, params);
    console.log(`data.service.ts: getUserByUsernameAPI - Found ${users.length} user(s) for username '${username}'. First user (if any):`, users[0]);
    return users.length > 0 ? users[0] : undefined;
};
export const getAllUsersAPI = async (): Promise<AuthUser[]> => {
    const params: Record<string, string | number> = {
        limit: 1000,
        offset: 0
    };
    if (USERS_VIEW_ID) {
        params.viewId = USERS_VIEW_ID;
    }
    return getList<AuthUser>(USERS_TABLE_PATH, params);
};
export const updateUserAPI = async (id: string, user: Partial<AuthUser>): Promise<AuthUser> => update<AuthUser>(USERS_TABLE_PATH, id, user);
export const deleteUserAPI = async (id: string): Promise<void> => remove(USERS_TABLE_PATH, id);


// Ingredient Operations
export const addIngredientAPI = async (ingredient: Ingredient): Promise<Ingredient> => create<Ingredient>(INGREDIENTS_TABLE_PATH, ingredient); 
export const getIngredientAPI = async (id: string): Promise<Ingredient | undefined> => {
    const params: Record<string, any> = { where: `(id,eq,${id})`, limit: 1 };
    if (INGREDIENTS_VIEW_ID) params.viewId = INGREDIENTS_VIEW_ID;
    const items = await getList<Ingredient>(INGREDIENTS_TABLE_PATH, params);
    return items.length > 0 ? items[0] : undefined;
};
export const getAllIngredientsAPI = async (): Promise<Ingredient[]> => {
    const params: Record<string, string | number> = {
        limit: 1000,
        offset: 0
    };
    if (INGREDIENTS_VIEW_ID) {
        params.viewId = INGREDIENTS_VIEW_ID;
    }
    return getList<Ingredient>(INGREDIENTS_TABLE_PATH, params);
};
export const updateIngredientAPI = async (id: string, ingredient: Partial<Ingredient>): Promise<Ingredient> => update<Ingredient>(INGREDIENTS_TABLE_PATH, id, ingredient);
export const deleteIngredientAPI = async (id: string): Promise<void> => remove(INGREDIENTS_TABLE_PATH, id);

// Dish Operations
export const addDishAPI = async (dish: Dish): Promise<Dish> => create<Dish>(DISHES_TABLE_PATH, dish);
export const getDishAPI = async (id: string): Promise<Dish | undefined> => {
    const params: Record<string, any> = { where: `(id,eq,${id})`, limit: 1 };
    if (DISHES_VIEW_ID) params.viewId = DISHES_VIEW_ID;
    const items = await getList<Dish>(DISHES_TABLE_PATH, params);
    return items.length > 0 ? items[0] : undefined;
};
export const getAllDishesAPI = async (): Promise<Dish[]> => {
    const params: Record<string, string | number> = {
        limit: 1000,
        offset: 0
    };
    if (DISHES_VIEW_ID) {
        params.viewId = DISHES_VIEW_ID;
    }
    return getList<Dish>(DISHES_TABLE_PATH, params);
};
export const updateDishAPI = async (id: string, dish: Partial<Dish>): Promise<Dish> => update<Dish>(DISHES_TABLE_PATH, id, dish);
export const deleteDishAPI = async (id: string): Promise<void> => remove(DISHES_TABLE_PATH, id);

// CookingItem Operations
export const addCookingItemAPI = async (item: CookingItem): Promise<CookingItem> => create<CookingItem>(COOKING_ITEMS_TABLE_PATH, item);
export const getCookingItemAPI = async (id: string): Promise<CookingItem | undefined> => {
    const params: Record<string, any> = { where: `(id,eq,${id})`, limit: 1 };
    if (COOKING_ITEMS_VIEW_ID) params.viewId = COOKING_ITEMS_VIEW_ID;
    const items = await getList<CookingItem>(COOKING_ITEMS_TABLE_PATH, params);
    return items.length > 0 ? items[0] : undefined;
};
export const getAllCookingItemsAPI = async (): Promise<CookingItem[]> => {
    const params: Record<string, string | number> = {
        limit: 1000,
        offset: 0
    };
    if (COOKING_ITEMS_VIEW_ID) {
        params.viewId = COOKING_ITEMS_VIEW_ID;
    }
    return getList<CookingItem>(COOKING_ITEMS_TABLE_PATH, params);
};
export const updateCookingItemAPI = async (id: string, item: Partial<CookingItem>): Promise<CookingItem> => update<CookingItem>(COOKING_ITEMS_TABLE_PATH, id, item);
export const deleteCookingItemAPI = async (id: string): Promise<void> => remove(COOKING_ITEMS_TABLE_PATH, id);

// Customer Operations
export const addCustomerAPI = async (customer: CustomerTableCreatePayload): Promise<Customer> => create<Customer>(CUSTOMERS_TABLE_PATH, customer);
export const getCustomerAPI = async (id: string): Promise<Customer | undefined> => {
    const params: Record<string, any> = { where: `(id,eq,${id})`, limit: 1 };
    if (CUSTOMERS_VIEW_ID) params.viewId = CUSTOMERS_VIEW_ID;
    const items = await getList<Customer>(CUSTOMERS_TABLE_PATH, params);
    return items.length > 0 ? items[0] : undefined;
};
export const getAllCustomersAPI = async (): Promise<Customer[]> => {
    const params: Record<string, string | number> = {
        limit: 1000,
        offset: 0
    };
    if (CUSTOMERS_VIEW_ID) {
        params.viewId = CUSTOMERS_VIEW_ID;
    }
    return getList<Customer>(CUSTOMERS_TABLE_PATH, params);
};
export const getCustomersByUserIdAPI = async (userId: string): Promise<Customer[]> => {
    const params: Record<string, any> = { 
        where: `(userId,eq,${userId})`,
        limit: 1000,
        offset: 0
    };
    if (CUSTOMERS_VIEW_ID) {
        params.viewId = CUSTOMERS_VIEW_ID;
    }
    return getList<Customer>(CUSTOMERS_TABLE_PATH, params);
};
export const updateCustomerAPI = async (id: string, customerData: CustomerTableUpdatePayload): Promise<Customer> => update<Customer>(CUSTOMERS_TABLE_PATH, id, customerData);
export const deleteCustomerAPI = async (id: string): Promise<void> => remove(CUSTOMERS_TABLE_PATH, id);


// --- Join Table Operations ---

export interface CustomerSelectedDishRecord {
  id: string; 
  customer_id: string; 
  dish_id: string;     
}
export const getCustomerSelectedDishesAPI = async (customerId: string): Promise<CustomerSelectedDishRecord[]> => {
    const params: Record<string, any> = { 
        where: `(customer_id,eq,${customerId})`,
        limit: 1000, 
        offset: 0
    };
    if (CUSTOMER_SELECTED_DISHES_VIEW_ID) {
        params.viewId = CUSTOMER_SELECTED_DISHES_VIEW_ID;
    }
    return getList<CustomerSelectedDishRecord>(CUSTOMER_SELECTED_DISHES_TABLE_PATH, params);
};
export const addCustomerSelectedDishAPI = async (selection: { customer_id: string; dish_id: string }): Promise<CustomerSelectedDishRecord> => {
    return create<CustomerSelectedDishRecord>(CUSTOMER_SELECTED_DISHES_TABLE_PATH, selection);
};
export const deleteCustomerSelectedDishAPI = async (joinRecordId: string): Promise<void> => {
    return remove(CUSTOMER_SELECTED_DISHES_TABLE_PATH, joinRecordId);
};


export interface CustomerSelectedCookingItemRecord {
  id: string; 
  customer_id: string;    
  cooking_item_id: string; 
  quantity: number;
}
export const getCustomerSelectedCookingItemsAPI = async (customerId: string): Promise<CustomerSelectedCookingItemRecord[]> => {
    const params: Record<string, any> = { 
        where: `(customer_id,eq,${customerId})`,
        limit: 1000, 
        offset: 0
    };
    if (CUSTOMER_SELECTED_COOKING_ITEMS_VIEW_ID) {
        params.viewId = CUSTOMER_SELECTED_COOKING_ITEMS_VIEW_ID;
    }
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
