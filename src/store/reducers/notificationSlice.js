import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/baseUrl";

const initialState = {
  notifications: [],
  notification: null,
  loading: false,
  error:null,
};

export const fetchNotifications = createAsyncThunk(
    "notification/fetchNotifications",
    async (_, {getState, rejectWithValue}) => {
        try{
            const token = getState().auth.token;
            const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              };
            const response = await api.get(`/api/notifications`, config)
            return response.data
        }catch (error){
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)


export const markRead = createAsyncThunk(
    "/notification/markRead",
    async (id,{rejectWithValue, getState})=>{
        try{
            const token = getState().auth.token;
            const config = {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
            const response = await api.post(`/api/notifications/${id}/read`, config)
            return response.data
        }catch(error){
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)


export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    },
extraReducers: (builder) =>{
    builder
    .addCase(fetchNotifications.pending, (state)=> {
        state.loading = true;
        state.error = null;
    })
    .addCase(fetchNotifications.fulfilled, (state, action)=>{
        state.loading = false;
        state.notifications = action?.payload?.data;
    })
    .addCase(fetchNotifications.rejected, (state, action)=>{
        state.loading = false;
        state.error = action.payload
    })
    .addCase(markRead.pending, (state)=>{
        state.loading = true;
        state.error = null
    })
    .addCase(markRead.fulfilled, (state, action)=>{
        state.loading = false;
        state.notification = action?.payload?.data;
    })
    .addCase(markRead.rejected, (state, action)=>{
        state.loading = false;
        state.error = action.payload;
    })
}
})


export default notificationSlice.reducer