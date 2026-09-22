import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../api/baseUrl";
import Cookies from "js-cookie";
import { loadData } from "../../../utilis/loadData";

const initialState = {
  initialized: false,
  superAdmin: null,
  admin: null,
  user: null,
  token: null,
  loading: false,
  error: null,
  message: "",
};

export const login = createAsyncThunk(
  "/login",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/login", loginData);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const register = createAsyncThunk(
  "/register",
  async (registerData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/register", registerData);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const logOut = createAsyncThunk(
  "/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/logout");
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const changePassword = createAsyncThunk(
  "/changePassword",
  async (newPasswordData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/changePassword", newPasswordData);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initialAuth: (state) => {
      const { token } = loadData();
      if (token) state.token = token;

      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        try {
          state.user = JSON.parse(storedUser);
        } catch {
          state.user = null;
        }
      }
      state.initialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action?.payload?.user;
        state.token = action?.payload?.token;
        sessionStorage.setItem("token", action.payload?.token);
        sessionStorage.setItem("user", JSON.stringify(action?.payload?.user));
        if (action.payload?.token) {
          Cookies.set("token", action.payload.token, { expires: 7 });
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action?.payload?.user;
        state.token = action?.payload?.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(logOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logOut.fulfilled, (state, action) => {
        state.loading = false;
        state.token = null;
        state.user = null;
        Cookies.remove("token");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
      })
      .addCase(logOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { initialAuth } = authSlice.actions;

export default authSlice.reducer;
