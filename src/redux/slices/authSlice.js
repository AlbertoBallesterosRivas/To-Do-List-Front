import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { fetchCsrfToken } from '../../services/api';

// Verificar el estado de autenticación
export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user/current");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user data");
    }
  }
);


// Registrar un nuevo usuario
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const csrfToken = await fetchCsrfToken();
      const response = await api.post(
        "/user/register?_format=json",
        {
          name: { value: username },
          mail: { value: email },
          pass: { value: password },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-CSRF-Token": csrfToken,
          },
        }
      );

      if (response.data) {
        const loginResponse = await api.post("/oauth/token", {
          grant_type: "password",
          username,
          password,
          client_id: process.env.REACT_APP_CLIENT_ID,
          client_secret: process.env.REACT_APP_CLIENT_SECRET,
        });

        return {
          access_token: loginResponse.data.access_token,
          user_id: loginResponse.data.user_id,
          username: username,
        };
      }
    } catch (error) {
      let errorMessage = "Registration failed";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// Iniciar sesión
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/oauth/token", {
        grant_type: "password",
        username,
        password,
        client_id: process.env.REACT_APP_CLIENT_ID,
        client_secret: process.env.REACT_APP_CLIENT_SECRET,
      });
      return {
        access_token: response.data.access_token,
        user_id: response.data.user_id,
        username: username,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

// Cerrar sesión
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  localStorage.removeItem("access_token");
  return true;
});

// Slice de autenticación
const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: !!localStorage.getItem("access_token"),
    loading: false,
    error: null,
    token: localStorage.getItem("access_token") || null,
    userId: null,
    username: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.userId = action.payload.user_id;
        state.username = action.payload.username;
        state.isLoading = false;
        state.error = null; // Reset error on successful check
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.token = null;
        state.userId = null;
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.access_token;
        state.userId = action.payload.user_id;
        state.username = action.payload.username;
        localStorage.setItem("access_token", action.payload.access_token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.userId = null;
        state.username = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.access_token;
        state.userId = action.payload.user_id;
        state.username = action.payload.username;
        localStorage.setItem("access_token", action.payload.access_token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      });
  },
});

export default authSlice.reducer;
