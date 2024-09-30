import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../services/api";

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
export const fetchUserTasks = createAsyncThunk(
  "auth/fetchUserTasks",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await api.get("/jsonapi/node/task", {
        params: {
          "filter[uid.id]": auth.userId,
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createTask = createAsyncThunk(
  "auth/createTask",
  async (taskData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await api.post(
        "/jsonapi/node/task",
        {
          data: {
            type: "node--task",
            attributes: {
              title: taskData.title,
              // Add other task attributes here as needed
            },
          },
        },
        {
          headers: {
            "Content-Type": "application/vnd.api+json",
            Accept: "application/vnd.api+json",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteTask = createAsyncThunk(
  "auth/deleteTask",
  async (taskId, { getState, rejectWithValue }) => {
    try {
      await api.delete(`/jsonapi/node/task/${taskId}`);
      return taskId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete task");
    }
  }
);

export const updateTask = createAsyncThunk(
  "auth/updateTask",
  async ({ taskId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/jsonapi/node/task/${taskId}`, {
        data: {
          type: "node--task",
          id: taskId,
          attributes: updatedData,
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update task");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
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
        localStorage.setItem("access_token", action.payload.access_token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Login failed";
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
        state.error = action.payload?.error || "Failed to fetch tasks";
      })
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to create task";
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to delete task";
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to update task";
      });
  },
});

export default authSlice.reducer;
