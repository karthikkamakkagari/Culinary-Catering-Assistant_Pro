
// src/apiService.ts
import { API_BASE_URL, NOCODB_API_TOKEN } from './apiConstants.ts';

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

  if (NOCODB_API_TOKEN && NOCODB_API_TOKEN !== 'YOUR_NOCODB_API_TOKEN_HERE') {
    defaultHeaders['xc-token'] = NOCODB_API_TOKEN;
  }
  
  const config: RequestInit = {
    method,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  let url = `${API_BASE_URL.replace(/\/$/, '')}${path}`;

  if (params && method === 'GET') {
    const queryParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== '') { // Also filter out empty string params
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
      let errorData: any;
      let errorDataString = ""; // For logging

      try {
        errorData = await response.json();
        try { 
          errorDataString = JSON.stringify(errorData); 
        } catch (stringifyError) { 
          errorDataString = "Could not stringify errorData JSON object. See Raw Object."; 
        }
      } catch (e) {
        // If response is not JSON, try to get text
        let errorText = "";
        try {
            errorText = await response.text();
             if (typeof errorText === 'string' && !errorText.trim().startsWith('<')) { // Avoid parsing HTML as message
                errorData = { message: errorText };
                errorDataString = errorText; // It's already a string
            } else {
                 errorData = { message: response.statusText, rawResponse: errorText.substring(0, 500) };
                 errorDataString = `StatusText: ${response.statusText}, RawResponse (partial HTML or non-JSON): ${errorText.substring(0,200)}`;
            }
        } catch (textErr) {
            errorData = { message: response.statusText }; // Fallback
            errorDataString = `StatusText: ${response.statusText}. Response body could not be parsed as JSON or text.`;
        }
      }
      
      console.error(
        'API Error Details:', response.status, 
        'Message String:', errorDataString, 
        'Raw Object:', errorData, 
        `URL: ${method} ${url}`
      );
      
      const error = new Error(errorData?.message || `API request failed with status ${response.status}`) as any;
      error.status = response.status;
      error.data = errorData; // The raw error object from NocoDB (or constructed)
      error.url = url;
      throw error;
    }

    if (response.status === 204 || response.headers.get("content-length") === "0") {
        return undefined as T; 
    }

    const responseJson = await response.json() as any;
    
    // NocoDB GET list requests return an object { list: [], pageInfo: {} }
    // We only care about the list.
    if (responseJson && Array.isArray(responseJson.list)) {
        return responseJson.list as T;
    }

    return responseJson as T;


  } catch (error) {
    // This catches network errors or errors thrown from the !response.ok block
    // console.error(`Network or other error in API request: ${method} ${url}`, error); // Already logged with more detail above
    throw error;
  }
}

// Generic CRUD helpers
export const getList = async <TItem>(path: string, params?: Record<string, any>): Promise<TItem[]> => {
    // NocoDB's list is a GET request to the main records path with query params in the URL
    // The response is { list: [], pageInfo: {} }, which the `request` function now handles.
    const items = await request<TItem[]>(path, { method: 'GET', params });
    return items;
};

export const getById = <T>(path: string, id: string): Promise<T> => request<T>(`${path}/${id}`);

export const create = <T>(path: string, data: any): Promise<T> => {
  console.log(`API Create Request to ${path} with data:`, JSON.stringify(data, null, 2));
  return request<T>(path, { method: 'POST', body: data });
};

export const update = <T>(path: string, id: string, data: any): Promise<T> => request<T>(`${path}/${id}`, { method: 'PATCH', body: data });
export const remove = (path: string, id: string): Promise<void> => request<void>(`${path}/${id}`, { method: 'DELETE' });

export const bulkCreate = <T>(path: string, data: any[]): Promise<T[]> => request<T[]>(path, {method: 'POST', body: data});
export const bulkUpdate = <T>(path: string, data: any[]): Promise<T[]> => request<T[]>(path, {method: 'PATCH', body: data});
export const bulkRemove = (path: string, ids: string[]): Promise<void> => request<void>(path, {method: 'DELETE', body: { ids }});

export const linkRecords = <T>(linkPath: string, data?: any): Promise<T> => request<T>(linkPath, { method: 'POST', body: data });
export const unlinkRecords = (linkPath: string): Promise<void> => request<void>(linkPath, { method: 'DELETE' });


export default request;
