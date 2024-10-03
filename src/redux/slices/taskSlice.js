import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../services/api';

// Función para guardar tareas en Local Storage
const saveTasksToLocalStorage = (tasks) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Función para cargar tareas desde Local Storage
const loadTasksFromLocalStorage = () => {
  const savedTasks = localStorage.getItem("tasks");
  return savedTasks ? JSON.parse(savedTasks) : [];
};

// Fetching user tasks from the API
export const fetchUserTasks = createAsyncThunk(
  "tasks/fetchUserTasks",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await api.get("/jsonapi/node/task", {
        params: {
          "filter[uid.name][value]": auth.username,
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch tasks");
    }
  }
);

// Creating a new task
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/jsonapi/node/task",
        {
          data: {
            type: "node--task",
            attributes: {
              title: taskData.title,
              field_end: taskData.date || null,
            },
            relationships: {
              field_tags: {
                data: taskData.tags.map(tag => ({
                  type: "taxonomy_term--tags",
                  id: tag.value,
                })),
              },
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
      return rejectWithValue(error.response?.data || "Task creation failed");
    }
  }
);

// Deleting a task
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId, { rejectWithValue }) => {
    try {
      await api.delete(`/jsonapi/node/task/${taskId}`);
      return taskId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete task");
    }
  }
);

// Updating a task
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ taskId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/jsonapi/node/task/${taskId}`, {
        data: {
          type: "node--task",
          id: taskId,
          attributes: {
            title: updatedData.title,
            field_end: updatedData.date,
          },
          relationships: {
            field_tags: {
              data: updatedData.field_tags,
            },
          },
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update task");
    }
  }
);

// Definición del slice
const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: loadTasksFromLocalStorage(), // Cargar tareas desde el localStorage
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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
        state.error = action.payload || "Failed to fetch tasks";
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
        state.error = action.payload || "Failed to create task";
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
        state.error = action.payload || "Failed to delete task";
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        saveTasksToLocalStorage(state.tasks);
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update task";
      });
  },
});

export default taskSlice.reducer;
