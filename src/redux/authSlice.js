import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from '../services/api';

// Endpoint base para las solicitudes a tu backend de Drupal
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://backend.ddev.site";

// Acción para iniciar sesión
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/oauth/token`, {
        grant_type: "password",
        username,
        password,
        client_id: process.env.REACT_APP_CLIENT_ID, // Añadir el client_id si es necesario
        client_secret: process.env.REACT_APP_CLIENT_SECRET, // Añadir el client_secret si es necesario
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Acción para cerrar sesión
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  localStorage.removeItem("access_token");
  return true;
});

// New action to fetch user tasks
export const fetchUserTasks = createAsyncThunk('auth/fetchUserTasks', async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await api.get('/jsonapi/node/task', {
        params: {
          'filter[uid.id]': auth.userId,
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  });
  const authSlice = createSlice({
    name: 'auth',
    initialState: {
      isAuthenticated: false,
      loading: false,
      error: null,
      token: null,
      userId: null,
      tasks: [],
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(loginUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.token = action.payload.access_token;
          state.userId = action.payload.user_id; // Assuming the API returns the user ID
          localStorage.setItem('access_token', action.payload.access_token);
        })
        .addCase(loginUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload?.error || 'Login failed';
        })
        .addCase(logoutUser.fulfilled, (state) => {
          state.isAuthenticated = false;
          state.token = null;
          state.userId = null;
          state.tasks = [];
        })
        .addCase(fetchUserTasks.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchUserTasks.fulfilled, (state, action) => {
          state.loading = false;
          state.tasks = action.payload;
        })
        .addCase(fetchUserTasks.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload?.error || 'Failed to fetch tasks';
        });
    },
  });

export default authSlice.reducer;
