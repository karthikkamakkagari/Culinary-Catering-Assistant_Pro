// src/apiConstants.ts

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !! CRITICAL CONFIGURATION !!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//
// API_BASE_URL: Set this to your NocoDB instance.
export const API_BASE_URL = 'https://app.nocodb.com/'; // User-provided specific URL
//
// NOCODB_API_TOKEN: Ensure this is your correct NocoDB API Token.
// You can generate this token in your NocoDB project settings.
export const NOCODB_API_TOKEN: string = 'ChKvc325bE9gCybhvfd3cmPQ3kcJlEw-Yf3QQFjW'; // User-provided token

// ----------------------------------------------------------------------------------
// !! CRITICAL !! VERIFY ALL TABLE PATHS AND IDs BELOW !!
// ----------------------------------------------------------------------------------
// The following paths are relative to your project's API root. Paths use /api/v2/
// If you still get "404 Table not found" errors after API_BASE_URL is correct,
// the issue is LIKELY an incorrect table ID (the string of characters like 'mynsbg8qtysazi8').
// Double-check these against your NocoDB API documentation for each table.
// Ensure paths start with a '/'.
// ----------------------------------------------------------------------------------

export const USERS_TABLE_PATH = '/api/v2/tables/mynsbg8qtysazi8/records'; 
export const INGREDIENTS_TABLE_PATH = '/api/v2/tables/maky773vh2dtb8q/records'; 
export const DISHES_TABLE_PATH = '/api/v2/tables/m11g7o7w5b00zzl/records'; 
export const COOKING_ITEMS_TABLE_PATH = '/api/v2/tables/m9t5s02mk66mzt7/records'; 
export const CUSTOMERS_TABLE_PATH = '/api/v2/tables/mj6uqbez8hfdplc/records'; 
export const CUSTOMER_SELECTED_DISHES_TABLE_PATH = '/api/v2/tables/m1ivv25o1x1zz99/records'; 
export const CUSTOMER_SELECTED_COOKING_ITEMS_TABLE_PATH = '/api/v2/tables/m7uletkex6j39hw/records';


// ----------------------------------------------------------------------------------
// !! NocoDB View IDs (Optional but Recommended for Consistency) !!
// ----------------------------------------------------------------------------------
// If you want your API calls to fetch data based on a specific view you've configured
// in NocoDB (e.g., with specific filters, sorts, or visible columns), set the
// viewId for that table below. You can find the viewId in the NocoDB UI (often in
// the URL when viewing a table view) or its API documentation for a specific view.
// If left as an empty string, NocoDB will use its default view for the table.
// The following values are taken from the user's provided API snippets.
// ----------------------------------------------------------------------------------

export const USERS_VIEW_ID = 'vwnhgxp9ze64j2v1';
export const INGREDIENTS_VIEW_ID = 'vweaemdakhnypf7d'; 
export const DISHES_VIEW_ID = 'vwlo2ef16qp4u0py';
export const COOKING_ITEMS_VIEW_ID = 'vw5dyxllyyh9uunp';
export const CUSTOMERS_VIEW_ID = 'vw9t0seu4bnrv9gw';
export const CUSTOMER_SELECTED_DISHES_VIEW_ID = 'vwdvcxc33hpjkb3zw';
export const CUSTOMER_SELECTED_COOKING_ITEMS_VIEW_ID = 'vw1lt0nmfd9qbd91';