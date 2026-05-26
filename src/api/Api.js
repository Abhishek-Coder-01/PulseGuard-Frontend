// const DEFAULT_API_ORIGIN = "https://pulseguard-backend-yuyh.onrender.com";(Ater one  month) wait
const DEFAULT_API_ORIGIN = "https://pulseguard-backend-zkbp.onrender.com/";
const API_PREFIX = "/api";
const DEFAULT_TIMEOUT_MS = 15000;
const PROJECT_CREATION_TIMEOUT_MS = 40000;
const PROJECT_PING_TIMEOUT_MS = 35000;

function normalizeBaseUrl(baseUrl) {
  const normalizedBaseUrl = String(baseUrl || DEFAULT_API_ORIGIN)
    .trim()
    .replace(/\/+$/, "");

  return normalizedBaseUrl.endsWith(API_PREFIX)
    ? normalizedBaseUrl
    : `${normalizedBaseUrl}${API_PREFIX}`;
}

const BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

const resolveToken = async (getToken) => {
  const token = await getToken?.();

  if (!token) {
    throw new Error("Authentication token missing. Please sign in again.");
  }

  return token;
};

// ─── Common helper ─────────────────────────────────────────────────────────────
const fetchWithAuth = async (url, token, options = {}) => {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    headers: optionHeaders,
    ...requestOptions
  } = options;
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  const headers = {
    Authorization: `Bearer ${token}`,
    ...(optionHeaders || {})
  };

  if (requestOptions.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  let res;
  try {
    res = await fetch(url, {
      ...requestOptions,
      signal: controller.signal,
      headers
    });
  } catch (err) {
    if (err?.name === "AbortError") {
      throw new Error("Request timed out while contacting the server.");
    }

    if (err instanceof TypeError) {
      throw new Error("Network error. The server may still be waking up.");
    }

    throw err;
  } finally {
    window.clearTimeout(timeoutId);
  }

  const text = await res.text();

  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Invalid JSON response from backend");
  }

  if (!res.ok) {
    throw new Error(data.message || `Request failed: ${res.status}`);
  }

  return data;
};

// ─── CHECK USER ────────────────────────────────────────────────────────────────
export const fetchUserFromBackend = async (getToken) => {
  const token = await resolveToken(getToken);
  return fetchWithAuth(`${BASE_URL}/check-user`, token);
};

// ─── GET PROJECTS ──────────────────────────────────────────────────────────────
export const getProjects = async (getToken, options = {}) => {
  const token = await resolveToken(getToken);
  return fetchWithAuth(`${BASE_URL}/projects`, token, options);
};

// ─── ADD PROJECT ───────────────────────────────────────────────────────────────
export const addProject = async (getToken, projectData, options = {}) => {
  const token = await resolveToken(getToken);
  return fetchWithAuth(`${BASE_URL}/projects`, token, {
    method: "POST",
    body: JSON.stringify(projectData),
    timeoutMs: PROJECT_CREATION_TIMEOUT_MS,
    ...options
  });
};

// ─── DELETE PROJECT ────────────────────────────────────────────────────────────
export const deleteProject = async (getToken, projectId) => {
  const token = await resolveToken(getToken);
  return fetchWithAuth(`${BASE_URL}/projects/${projectId}`, token, {
    method: "DELETE"
  });
};

// ─── PING URL ──────────────────────────────────────────────────────────────────
export const pingUrl = async (getToken, url, projectId, options = {}) => {
  const token = await resolveToken(getToken);
  const params = new URLSearchParams({ url });
  if (projectId) params.append("projectId", projectId);
  return fetchWithAuth(`${BASE_URL}/projects/ping?${params.toString()}`, token, {
    timeoutMs: PROJECT_PING_TIMEOUT_MS,
    ...options
  });
};

// ─── GET PROJECT LOGS (for chart) ─────────────────────────────────────────────
export const getProjectLogs = async (getToken, projectId, limit) => {
  const token = await resolveToken(getToken);
  const params = new URLSearchParams();
  if (limit) params.append("limit", String(limit));
  const query = params.toString() ? `?${params.toString()}` : "";
  return fetchWithAuth(`${BASE_URL}/projects/${projectId}/logs${query}`, token);
};

// ─── GET PROJECT UPTIME ────────────────────────────────────────────────────────
export const getProjectUptime = async (getToken, projectId, options = {}) => {
  const token = await resolveToken(getToken);
  return fetchWithAuth(`${BASE_URL}/projects/${projectId}/uptime`, token, options);
};
