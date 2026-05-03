const BASE_URL = "http://localhost:5000/api";
const DEFAULT_TIMEOUT_MS = 15000;

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

  let res;
  try {
    res = await fetch(url, {
      ...requestOptions,
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(optionHeaders || {})
      }
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
  const token = await getToken();
  return fetchWithAuth(`${BASE_URL}/check-user`, token);
};

// ─── GET PROJECTS ──────────────────────────────────────────────────────────────
export const getProjects = async (getToken, options = {}) => {
  const token = await getToken();
  return fetchWithAuth(`${BASE_URL}/projects`, token, options);
};

// ─── ADD PROJECT ───────────────────────────────────────────────────────────────
export const addProject = async (getToken, projectData) => {
  const token = await getToken();
  return fetchWithAuth(`${BASE_URL}/projects`, token, {
    method: "POST",
    body: JSON.stringify(projectData)
  });
};

// ─── DELETE PROJECT ────────────────────────────────────────────────────────────
export const deleteProject = async (getToken, projectId) => {
  const token = await getToken();
  return fetchWithAuth(`${BASE_URL}/projects/${projectId}`, token, {
    method: "DELETE"
  });
};

// ─── PING URL ──────────────────────────────────────────────────────────────────
export const pingUrl = async (getToken, url, projectId) => {
  const token = await getToken();
  const params = new URLSearchParams({ url });
  if (projectId) params.append("projectId", projectId);
  return fetchWithAuth(`${BASE_URL}/projects/ping?${params.toString()}`, token);
};

// ─── GET PROJECT LOGS (for chart) ─────────────────────────────────────────────
export const getProjectLogs = async (getToken, projectId, limit) => {
  const token = await getToken();
  const params = new URLSearchParams();
  if (limit) params.append("limit", String(limit));
  const query = params.toString() ? `?${params.toString()}` : "";
  return fetchWithAuth(`${BASE_URL}/projects/${projectId}/logs${query}`, token);
};

// ─── GET PROJECT UPTIME ────────────────────────────────────────────────────────
export const getProjectUptime = async (getToken, projectId, options = {}) => {
  const token = await getToken();
  return fetchWithAuth(`${BASE_URL}/projects/${projectId}/uptime`, token, options);
};
