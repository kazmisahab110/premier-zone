import axios from "axios";

const apiBaseUrl =
    import.meta.env.VITE_API_URL?.trim() ||
    "http://localhost:8080";

const apiClient = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("premierZoneToken");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default apiClient;