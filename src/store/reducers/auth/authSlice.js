import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../api/baseUrl";
import Cookies from "js-cookie";
import { loadData } from "../../../utilis/loadData";

const initialState = {
  initialized: false,
  users: [],
  user: null,
  role: null,
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
  }
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
  }
);

export const fetchUsers = createAsyncThunk(
  "/users",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/users");
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getActiveUser = createAsyncThunk(
  "/user",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/user");
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
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
  }
);

export const changePassword = createAsyncThunk(
  "/changePassword",
  async (newPasswordData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/api/changePassword",
        newPasswordData
      );

      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const getUserRole = (user) => {
  if (!user) return null;

  if (user.is_super_admin === 1) {
    return "superAdmin";
  }

  if (user.is_admin === 1) {
    return "admin";
  }

  return "user";
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    initialAuth: (state) => {
      const { token } = loadData();

      const storedUser = localStorage.getItem("user");
      const storedRole = localStorage.getItem("role");

      if (token) {
        state.token = token;
      }

      if (storedUser) {
        try {
          state.user = JSON.parse(storedUser);
        } catch {
          state.user = null;
        }
      }

      if (storedRole) {
        state.role = storedRole;
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

        const user = action?.payload?.user;
        const token = action?.payload?.token;

        const role = getUserRole(user);

        state.user = user;
        state.role = role;
        state.token = token;

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", role);

        if (token) {
          localStorage.setItem("token", token);

          Cookies.set("token", token, {
            expires: 7,
          });
        }
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message || "Login failed";
      })

      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const user = action?.payload?.user;
        const token = action?.payload?.token;

        const role = getUserRole(user);

        state.user = user;
        state.role = role;
        state.token = token;

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", role);

        if (token) {
          localStorage.setItem("token", token);

          Cookies.set("token", token, {
            expires: 7,
          });
        }
      })

      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message || "Registration failed";
      })

      .addCase(fetchUsers.pending, (state) =>{
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action)=> {
        state.users = action?.payload?.data;
        state.loading = false;
        
      })
      .addCase(fetchUsers.rejected, (state, action)=>{
        state.loading = false;
        state.error = action?.payload?.message;
      })
      .addCase(getActiveUser.pending, (state) =>{
        state.loading = true;
        state.error = null;
      })
      .addCase(getActiveUser.fulfilled, (state, action)=> {
        state.user = action?.payload?.data;
        state.loading = false;
        
      })
      .addCase(getActiveUser.rejected, (state, action)=>{
        state.loading = false;
        state.error = action?.payload?.message;
      })

      .addCase(logOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(logOut.fulfilled, (state) => {
        state.loading = false;

        state.user = null;
        state.role = null;
        state.token = null;
        state.error = null;

        Cookies.remove("token");

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        sessionStorage.removeItem("profile");
      sessionStorage.removeItem("QR Profile");
      sessionStorage.removeItem("profileCreated");
      sessionStorage.removeItem("QR Profile Edited");
      })

      .addCase(logOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message || "Logout failed";
      })

      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action?.payload?.message || "";
      })

      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action?.payload?.message || "Password change failed";
      });
  },
});

export const { initialAuth } = authSlice.actions;

export default authSlice.reducer;