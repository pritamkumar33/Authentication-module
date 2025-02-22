// import axios from "axios";

// interface LoginCredentials {
//   username: string;
//   password: string;
// }


// const API_URL = "http://127.0.0.1:8000";

// const api = axios.create({
//   baseURL: API_URL,
//   headers: { "Content-Type": "application/json" },
// });

// export const registerUser = async (data: { username: string; password: string }) => {
//   return api.post("/register", data);
// };

// export const loginUser = async (credentials:LoginCredentials) => {
//   return await axios.post(`${API_URL}/token`, credentials, {
//     headers: {
//       "Content-Type": "application/json",
//     },
//     withCredentials: true, // Ensure cookies are sent (if needed)
//   });
// };

// export const getUserDetails = async () => {
//   return api.get("/users", {
//     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//   });
// };

// export default api;


import axios from "axios";

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  password: string;
}

const API_URL = "http://127.0.0.1:8000";

// ✅ Create an API instance for all requests
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Use only if your backend requires cookies
});

// ✅ Register User
export const registerUser = async (data: RegisterCredentials) => {
  try {
    const response = await api.post("/register", data);
    return response.data; // Return only necessary data
  } catch (error: any) {
    console.error("Register error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || "Registration failed");
  }
};

// ✅ Login User
export const loginUser = async (credentials: LoginCredentials) => {
  try {
    const formData = new URLSearchParams();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);

    const response = await api.post("/token", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    console.log("Login API Response:", response);
    return response.data;
  } catch (error: any) {
    console.error("Login error:", JSON.stringify(error.response?.data, null, 2));
    throw new Error(
      error.response?.data?.detail
        ? JSON.stringify(error.response.data.detail)
        : "Login failed"
    );
  }
};

// ✅ Get User Details
export const getUserDetails = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log("Token being used:", token); 
    
    if (!token) {
      throw new Error("No token found, please log in.");
    }
    console.log("Fetching user details from:", `${API_URL}/users/me`);
    const response = await api.get("/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error: any) {
    console.error("User details error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || "Failed to fetch user details");
  }
};

export default api;
