import { APP_CONFIG } from "@/config/app.config";

const BASE_URL = APP_CONFIG.apiBaseUrl;

/**
 * Generic API helper.
 * Currently returns mock/empty data since backend isn't ready.
 * When backend is ready, uncomment the fetch calls.
 */

async function request(method, endpoint, data = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.warn(`API call failed (${method} ${endpoint}):`, error.message);
    return null;
  }
}

export const apiGet = (endpoint) => request("GET", endpoint);
export const apiPost = (endpoint, data) => request("POST", endpoint, data);
export const apiPut = (endpoint, data) => request("PUT", endpoint, data);
export const apiDelete = (endpoint) => request("DELETE", endpoint);
