// src/apiConstants.ts

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !! CRITICAL CONFIGURATION !!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//
// API_BASE_URL: Based on your NocoDB API call snippet, this should be:
export const API_BASE_URL = 'https://app.nocodb.com/'; 
// If you are self-hosting NocoDB on a different domain, update this accordingly.
// e.g., 'http://localhost:8080' or 'https://your-nocodb.yourdomain.com'
//
// NOCODB_API_TOKEN: Ensure this is your correct NocoDB API Token.
// You can generate this token in your NocoDB project settings.
export const NOCODB_API_TOKEN: string = 'ChKvc325bE9gCybhvfd3cmPQ3kcJlEw-Yf3QQFjW'; // User-provided token

// ----------------------------------------------------------------------------------
// !! CRITICAL !! VERIFY ALL TABLE PATHS AND IDs BELOW !!
// ----------------------------------------------------------------------------------
// The following paths are relative to your project's API root.
// If you still get "404 Table not found" errors after API_BASE_URL and API version are correct,
// the issue is LIKELY an incorrect table ID (the string of characters like 'mynsbg8qtysazi8').
// Double-check these against your NocoDB API documentation for each table within your specific project.
// You can find these IDs in your NocoDB project UI or its API documentation.
// ----------------------------------------------------------------------------------
// Paths are /api/v2/ based on user's NocoDB snippets. Ensure paths start with a '/'.

export const USERS_TABLE_PATH = '/api/v2/tables/mynsbg8qtysazi8/records'; 
export const INGREDIENTS_TABLE_PATH = '/api/v2/tables/maky773vh2dtb8q/records'; 
export const DISHES_TABLE_PATH = '/api/v2/tables/m11g7o7w5b00zzl/records'; 
export const COOKING_ITEMS_TABLE_PATH = '/api/v2/tables/m9t5s02mk66mzt7/records'; 
export const CUSTOMERS_TABLE_PATH = '/api/v2/tables/mj6uqbez8hfdplc/records'; 
export const CUSTOMER_SELECTED_DISHES_TABLE_PATH = '/api/v2/tables/m1ivv25o1x1zz99/records'; 
export const CUSTOMER_SELECTED_COOKING_ITEMS_TABLE_PATH = '/api/v2/tables/m7uletkex6j39hw/records';