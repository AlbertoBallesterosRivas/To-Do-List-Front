import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { fetchCsrfToken } from '../../services/api';

export const fetchTaxonomies = createAsyncThunk(
  "taxonomy/fetchTaxonomies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/jsonapi/taxonomy_term/tags");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch taxonomies");
    }
  }
);

export const createTaxonomy = createAsyncThunk(
  "taxonomy/createTaxonomy",
  async (name, { rejectWithValue }) => {
    try {
      const csrfToken = await fetchCsrfToken();
      const response = await api.post(
        "/jsonapi/taxonomy_term/tags",
        {
          data: {
            type: "taxonomy_term--tags",
            attributes: {
              name: name,
            },
          },
        },
        {
          headers: {
            "Content-Type": "application/vnd.api+json",
            "Accept": "application/vnd.api+json",
            "X-CSRF-Token": csrfToken,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create taxonomy");
    }
  }
);

export const deleteTaxonomy = createAsyncThunk(
  "taxonomy/deleteTaxonomy",
  async (taxonomyId, { rejectWithValue }) => {
    try {
      await api.delete(`/jsonapi/taxonomy_term/tags/${taxonomyId}`);
      return taxonomyId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete taxonomy");
    }
  }
);

const taxonomySlice = createSlice({
  name: "taxonomy",
  initialState: {
    taxonomies: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaxonomies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaxonomies.fulfilled, (state, action) => {
        state.loading = false;
        state.taxonomies = action.payload;
      })
      .addCase(fetchTaxonomies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTaxonomy.fulfilled, (state, action) => {
        state.taxonomies.push(action.payload);
      })
      .addCase(deleteTaxonomy.fulfilled, (state, action) => {
        state.taxonomies = state.taxonomies.filter(tax => tax.id !== action.payload);
      });
  },
});

export default taxonomySlice.reducer;