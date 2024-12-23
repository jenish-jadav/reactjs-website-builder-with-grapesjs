import axios from "axios";

const apiService = axios.create({
  baseURL: "https://website.local/api", // Laravel API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add Authorization token for logged-in users
// export const setAuthToken = (token) => {
//     if (token) {
//         apiService.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//     } else {
//         delete apiService.defaults.headers.common["Authorization"];
//     }
// };

export default apiService;