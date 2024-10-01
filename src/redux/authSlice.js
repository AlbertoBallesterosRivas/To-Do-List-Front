import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../services/api";

// Endpoint base para las solicitudes a tu backend de Drupal
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://backend.ddev.site";

// Función para guardar tareas en el localStorage
const saveTasksToLocalStorage = (tasks) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Función para obtener tareas del localStorage
const loadTasksFromLocalStorage = () => {
  const savedTasks = localStorage.getItem("tasks");
  return savedTasks ? JSON.parse(savedTasks) : [];
};

const fetchCsrfToken = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/session/token`);
    return response.data; // This should return the CSRF token
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
    throw error;
  }
};
// export const registerUser = createAsyncThunk(
//   "auth/registerUser",
//   async ({ username, email, password }, { rejectWithValue }) => {
//     try {
//       console.log("username, email, password", username, email, password)
//       const response = await axios.post(`${API_BASE_URL}/user/register?_format=json`, {
//         name: [{ value: username }],
//         mail: [{ value: email }],
//         pass: [{ value: password }],
//       }, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//       console.log("respuesta registerUser", response)
//       // If registration is successful, we can automatically log the user in
//       if (response.data) {
//         const loginResponse = await axios.post(`${API_BASE_URL}/oauth/token`, {
//           grant_type: "password",
//           username,
//           password,
//           client_id: process.env.REACT_APP_CLIENT_ID,
//           client_secret: process.env.REACT_APP_CLIENT_SECRET,
//         });

//         return {
//           access_token: loginResponse.data.access_token,
//           user_id: loginResponse.data.user_id,
//           username: username,
//         };
//       }
//     } catch (error) {
//       return rejectWithValue(error.response?.data || "Registration failed");
//     }
//   }
// );

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      // Fetch the CSRF token
      const csrfToken = await fetchCsrfToken();
      console.log("username, email, password", username, email, password);
      const response = await axios.post(
        `${API_BASE_URL}/user/register?_format=json`,
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

      console.log("respuesta registerUser", response);

      if (response.data) {
        const loginResponse = await axios.post(`${API_BASE_URL}/oauth/token`, {
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
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async (_, { getState, dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        // Realiza una solicitud para obtener el usuario actual
        const response = await axios.get(`${API_BASE_URL}/jsonapi/user/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/vnd.api+json",
          },
        });

        // Supongamos que la respuesta contiene los datos del usuario
        const user = response.data.data[0]; // Ajusta según la estructura de tu respuesta
        return {
          token,
          userId: user.id, // UUID del usuario
          username: user.attributes.name,
        };
      } catch (error) {
        // Si hay un error (por ejemplo, token inválido), limpia el localStorage
        localStorage.removeItem("access_token");
        return rejectWithValue("Token inválido o expirado");
      }
    } else {
      return rejectWithValue("");
      //return rejectWithValue("No hay token almacenado");
    }
  }
);

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
      console.log("response.data login", response.data);
      //return response.data;
      return {
        access_token: response.data.access_token,
        user_id: response.data.user_id, // Asegúrate de que este campo sea correcto
        username: username,
      };
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
      console.log("auth.usernma", auth.username);
      const response = await api.get("/jsonapi/node/task", {
        params: {
          "filter[uid.name][value]": auth.username,
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// export const createTask = createAsyncThunk(
//   "auth/createTask",
//   async (taskData, { getState, rejectWithValue }) => {
//     try {
//       console.log("field_end: taskData.date", taskData.date)
//       console.log("field_end: taskData.tags", taskData.tags)
//       const response = await api.post(
//         "/jsonapi/node/task",
//         {
//           data: {
//             type: "node--task",
//             attributes: {
//               title: taskData.title,
//               field_end: taskData.date || null,
//               field_tags: taskData.tags || []
//             },
//           },
//         },
//         {
//           headers: {
//             "Content-Type": "application/vnd.api+json",
//             Accept: "application/vnd.api+json",
//           },
//         }
//       );
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

export const createTask = createAsyncThunk(
  "auth/createTask",
  async (taskData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState(); // Extraer el estado de autenticación para obtener el token
      const csrfToken = "YOUR_CSRF_TOKEN"; // Aquí obtén el token CSRF de donde lo hayas almacenado

      console.log("field_end: taskData.date", taskData.date);
      console.log("field_end: taskData.tags", taskData.tags);

      const response = await api.post(
        "/jsonapi/node/task",
        {
          data: {
            type: "node--task",
            attributes: {
              title: taskData.title,
              field_end: taskData.date || null,
              //field_tags: taskData.tags.length > 0 ? taskData.tags : undefined
            },
          },
        },
        {
          headers: {
            "Content-Type": "application/vnd.api+json",
            Accept: "application/vnd.api+json",
            Authorization: `Bearer ${auth.accessToken}`, // Token de autorización
            "X-CSRF-Token": csrfToken, // Token CSRF
          },
        }
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Task creation failed");
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

const token = localStorage.getItem("access_token");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: !!token,
    loading: false,
    error: null,
    token: token || null,
    userId: null,
    username: null,
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
        state.username = action.payload.username;
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
        localStorage.removeItem("tasks");
      })
      .addCase(fetchUserTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
        saveTasksToLocalStorage(state.tasks);
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
        saveTasksToLocalStorage(state.tasks);
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
        saveTasksToLocalStorage(state.tasks);
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
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.userId = action.payload.userId;
        state.username = action.payload.username;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.token = null;
        state.userId = null;
        state.error = action.payload;
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
