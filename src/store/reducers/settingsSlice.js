import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/baseUrl";


const initialState = {
  settings: null,
  loading: false,
  error:null,
};


export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/settings");
      return response.data?.data ?? response.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data || { message: err?.message || "حدث خطأ ما" },
      );
    }
  },
);

export const createSettings = createAsyncThunk(
  "settings/createSettings",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/settings", formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data || { message: err?.message || "حدث خطأ ما" },
      );
    }
  },
);

export const updateSettings = createAsyncThunk(
  "settings/createSettings",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/settings/update", formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data || { message: err?.message || "حدث خطأ ما" },
      );
    }
  },
);

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload?.data;
      })
      .addCase(createSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      })
      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload?.data;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      });
  },
});

export default settingsSlice.reducer;