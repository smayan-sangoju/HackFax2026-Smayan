/**
 * TriageSense Backend API Client
 * All network logic lives here. Components must import from this module only.
 */

// In dev: use Vite proxy (/api) to avoid CORS. In prod: use env or default.
const BASE_URL =
  import.meta.env.DEV
    ? '/api'
    : (import.meta.env.REACT_APP_API_URL ||
       import.meta.env.VITE_API_URL ||
       'http://localhost:5000');

async function request(endpoint, options = {}) {
  const url = `${BASE_URL.replace(/\/$/, '')}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  const res = await fetch(url, config);
  if (!res.ok) {
    const err = new Error(`API error: ${res.status} ${res.statusText}`);
    err.status = res.status;
    err.response = res;
    try {
      err.body = await res.json();
    } catch {
      err.body = await res.text();
    }
    throw err;
  }
  return res.json();
}

/**
 * POST /diagnose
 * @param {{ symptoms: string }} body
 * @returns {Promise<{ condition: string, severity: number, reasoning: string }>}
 */
export async function diagnose(body) {
  return request('/diagnose', {
    method: 'POST',
    body: JSON.stringify({ symptoms: body.symptoms }),
  });
}

/**
 * POST /hospitals
 * @param {{ latitude: number, longitude: number }} body
 * @returns {Promise<Array<{ name: string, distance: number, travelTime: number }>>}
 */
export async function getHospitals(body) {
  return request('/hospitals', {
    method: 'POST',
    body: JSON.stringify({
      latitude: body.latitude,
      longitude: body.longitude,
    }),
  });
}

/**
 * POST /waittimes
 * @param {{ hospitals: string[] }} body
 * @returns {Promise<Array<{ name: string, waitTime: number }>>}
 */
export async function getWaitTimes(body) {
  return request('/waittimes', {
    method: 'POST',
    body: JSON.stringify({ hospitals: body.hospitals }),
  });
}

/**
 * POST /rank
 * @param {{ hospitals: any[], waitTimes: any[], diagnosis: any }} body
 * @returns {Promise<{ top3: Array<{ name: string, totalTime: number }> }>}
 */
export async function rank(body) {
  return request('/rank', {
    method: 'POST',
    body: JSON.stringify({
      hospitals: body.hospitals,
      waitTimes: body.waitTimes,
      diagnosis: body.diagnosis,
    }),
  });
}

// --- Auth (placeholder / simulated until backend implements) ---

/**
 * Register user. Placeholder: simulates success.
 * @param {{ firstName: string, lastName: string, age: number, gender: string, email: string, password: string }} data
 * @returns {Promise<{ success: boolean }>}
 */
export async function registerUser(data) {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 600));
  return { success: true };
}

/**
 * Login user. Placeholder: simulates success, returns mock token.
 * @param {{ email: string, password: string }} data
 * @returns {Promise<{ success: boolean, token: string }>}
 */
export async function loginUser(data) {
  await new Promise((r) => setTimeout(r, 600));
  return { success: true, token: 'mock-token' };
}
