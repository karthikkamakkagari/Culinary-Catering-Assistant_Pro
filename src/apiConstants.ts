// src/apiConstants.ts

// IMPORTANT: Replace with your actual API base URL
export const API_BASE_URL = 'https://app.nocodb.com/'; // e.g., 'https://xano-instance-id.xano.io'

// IMPORTANT: Set your NocoDB API Token here.
// You can generate this token in your NocoDB project settings (usually under API Tokens or Project Users).
// This token should be kept secret and ideally managed via environment variables in production.
export const NOCODB_API_TOKEN = 'YOUR_NOCODB_API_TOKEN_HERE'; // <--- REPLACE THIS WITH YOUR ACTUAL TOKEN

// ----------------------------------------------------------------------------------
// !! CRITICAL !! VERIFY ALL TABLE PATHS BELOW !!
// The following paths MUST match your NocoDB project's table REST API paths.
// The most common error is an incorrect table ID (the string of characters between /tables/ and /records).
// Double-check these against your NocoDB API documentation for each table.
// ----------------------------------------------------------------------------------

export const USERS_TABLE_PATH = '/api/v2/tables/mynsb8g9qtysazi8/records'; // Example: If 'mynsb8g9qtysazi8' is wrong, this will cause a 404.
export const INGREDIENTS_TABLE_PATH = '/api/v2/tables/maky773vh2dtb8q/records';
export const DISHES_TABLE_PATH = '/api/v2/tables/m11g7o7w5b00zzl/records';
export const COOKING_ITEMS_TABLE_PATH = '/api/v2/tables/m9t5s02mk66mzt7/records';
export const CUSTOMERS_TABLE_PATH = '/api/v2/tables/mj6uqbez8hfdplc/records';
export const CUSTOMER_SELECTED_DISHES_TABLE_PATH = '/api/v2/tables/m1ivv25o1x1zz99/records';
export const CUSTOMER_SELECTED_COOKING_ITEMS_TABLE_PATH = '/api/v2/tables/m7uletkex6j39hw/records';

// Note: The image mentions 8 tables, but lists 7 specific API paths.
// If there's an 8th table entity managed by the frontend (e.g. "customer_cooking_items" vs "customer_selected_cooking_items"), add its path here.
// Based on the image, "cooking_items" has its own CRUD, and "customer_selected_cooking_items" also has its own CRUD.
// "customer_selected_cooking_items" seems like the join table.
// "user" table is listed.
// The 7 distinct tables appear to be:
// 1. customer_selected_cooking_items
// 2. cooking_items
// 3. customer_selected_dishes
// 4. customers
// 5. dishes
// 6. ingredients
// 7. users
// The image shows 7 groups of API endpoints. It seems I have paths for all 7 groups mentioned.
// Let's assume the user has 7 tables they want to interact with based on the API list. If an 8th distinct table needs a path, it can be added.