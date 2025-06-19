// src/apiService.ts
import { API_BASE_URL, NOCODB_API_TOKEN } from './apiConstants'; // Corrected to relative path

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number | boolean>; // For query parameters
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, params } = options;
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add NocoDB API Token if available
  if (NOCODB_API_TOKEN && NOCODB_API_TOKEN !== 'ChKvc325bE9gCybhvfd3cmPQ3kcJlEw-Yf3QQFjW') {
    defaultHeaders['xc-token'] = NOCODB_API_TOKEN;
  }
  
  const config: RequestInit = {
    method,
    headers: {
      ...defaultHeaders,
      ...options.headers, // Allow overriding or adding more headers
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  let url = `${API_BASE_URL.replace(/\/$/, '')}${path}`; // Ensure no double slashes if API_BASE_URL ends with /

  if (params) {
    const queryParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined) {
        queryParams.append(key, String(params[key]));
      }
    }
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }
      console.error('API Error Details:', response.status, errorData, `URL: ${method} ${url}`);
      // Construct a more informative error
      const error = new Error(errorData?.message || `API request failed with status ${response.status}`) as any;
      error.status = response.status;
      error.data = errorData;
      error.url = url; // Add URL to error for easier debugging
      throw error;
    }

    if (response.status === 204 || response.headers.get("content-length") === "0") { // No Content
        return undefined as T; 
    }

    const responseData = await response.json();
    // NocoDB often wraps list results in an object like { list: [], pageInfo: {} }
    // For GET all (getList), we typically want just the list.
    // For GET by ID or other operations, it might return the object directly.
    if (method === 'GET' && params && responseData && typeof responseData === 'object' && 'list' in responseData && Array.isArray((responseData as any).list)) {
        return (responseData as any).list as T;
    }
    return responseData as T;

  } catch (error) {
    console.error(`Network or other error in API request: ${method} ${url}`, error);
    throw error; // Re-throw to be caught by calling function
  }
}

// Generic CRUD helpers
export const getList = async <TItem>(path: string, params?: Record<string, string | number | boolean>): Promise<TItem[]> => {
    // For NocoDB, getList might directly get an array if the API path itself returns the list
    // or it might get an object { list: [], pageInfo: {} }
    // The request function above attempts to return `responseData.list` if `method === 'GET' && params` is true.
    // Let's ensure this is robust.
    const responseData = await request<TItem[] | { list: TItem[], pageInfo: any }>(path, { params });

    if (Array.isArray(responseData)) {
        return responseData;
    }
    if (responseData && typeof responseData === 'object' && 'list' in responseData && Array.isArray((responseData as any).list)) {
        return (responseData as any).list;
    }
    // If the response is not an array and not an object with a 'list' property,
    // and it was supposed to be a list, then it's an unexpected format.
    console.warn(`getList received an unexpected response structure for path ${path}. Expected array or {list: [...]}. Got:`, responseData);
    return []; // Return empty array as a safe fallback for list operations
};

export const getById = <T>(path: string, id: string): Promise<T> => request<T>(`${path}/${id}`);
export const create = <T>(path: string, data: any): Promise<T> => request<T>(path, { method: 'POST', body: data });
export const update = <T>(path: string, id: string, data: any): Promise<T> => request<T>(`${path}/${id}`, { method: 'PATCH', body: data });
export const remove = (path: string, id: string): Promise<void> => request<void>(`${path}/${id}`, { method: 'DELETE' });

// Bulk operations (ensure your BaaS supports these formats)
// NocoDB bulk operations might have specific endpoints or payload structures.
// These are generic placeholders and might need adjustment for NocoDB.
export const bulkCreate = <T>(path: string, data: any[]): Promise<T[]> => request<T[]>(path, {method: 'POST', body: data}); // NocoDB might expect POST for bulk create
export const bulkUpdate = <T>(path: string, data: any[]): Promise<T[]> => request<T[]>(path, {method: 'PATCH', body: data});
export const bulkRemove = (path: string, ids: string[]): Promise<void> => request<void>(path, {method: 'DELETE', body: { ids }});

// Specific function for POSTing to links (if needed, based on BaaS structure for linking)
export const linkRecords = <T>(linkPath: string, data?: any): Promise<T> => request<T>(linkPath, { method: 'POST', body: data });
export const unlinkRecords = (linkPath: string): Promise<void> => request<void>(linkPath, { method: 'DELETE' });


export default request;