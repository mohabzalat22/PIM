import axios from "axios";

const BASE_URL = "http://localhost:3000/api/v1";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Required to send and receive cookies
});

let csrfToken: string | null = null;

// Fetch CSRF token on initialization
const fetchCsrfToken = async () => {
  try {
    const response = await apiClient.get("/csrf-token");
    csrfToken = response.data.csrfToken;
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
  }
};

// Initialize CSRF token
fetchCsrfToken();

// Request interceptor to add CSRF token to requests
apiClient.interceptors.request.use(
  async (config) => {
    const methodsToProtect = ["post", "put", "patch", "delete"];
    
    if (methodsToProtect.includes(config.method?.toLowerCase() || "")) {
      // If we don't have a token yet, fetch it
      if (!csrfToken) {
        await fetchCsrfToken();
      }
      
      // Add CSRF token to headers
      if (csrfToken) {
        config.headers["csrf-token"] = csrfToken;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle CSRF errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If we get a 403 (CSRF error), try to refresh the token and retry
    if (error.response?.status === 403 && error.config && !error.config._retry) {
      error.config._retry = true;
      
      // Refresh CSRF token
      await fetchCsrfToken();
      
      // Update the failed request with new token
      if (csrfToken) {
        error.config.headers["csrf-token"] = csrfToken;
      }
      
      // Retry the request
      return apiClient(error.config);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;