import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/baseUrl";

const initialState = {
  subscriptions: [],
  subscription: null,
  loading: false,
  error:null,
};

export const fetchSubscriptions = createAsyncThunk(
    "subscription/fetchSubscriptions",
    async (_, {getState, rejectWithValue}) => {
        try{
            const token = getState().auth.token;
            const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              };
            const response = await api.get(`/api/subscriptions`, config)
            return response.data
        }catch (error){
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const createSubscription = createAsyncThunk(
    "/subscription/createSubscription",
    async (subscriptionData,{rejectWithValue, getState})=>{
        try{
            const token = getState().auth.token;
            const config = {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
            const response = await api.post(`/api/subscriptions`, subscriptionData, config)
            return response.data
        }catch(error){
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const renewSubscription = createAsyncThunk(
    "/subscription/renewSubscription",
    async ({id, renewData},{rejectWithValue, getState})=>{
        try{
            const token = getState().auth.token;
            const config = {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
            const response = await api.post(`/api/subscriptions/${id}/renew`, renewData, config)
            return response.data
        }catch(error){
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const diactivateSubscription = createAsyncThunk(
    "/subscription/diactivateSubscription",
    async (id,{rejectWithValue, getState})=>{
        try{
            const token = getState().auth.token;
            const config = {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
            const response = await api.post(`/api/subscriptions/${id}/inactive`, config)
            return response.data
        }catch(error){
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const updateSubscription = createAsyncThunk(
    "/subscription/updateSubscription",
    async ({id, updatedData},{rejectWithValue, getState})=>{
        try{
            const token = getState().auth.token;
            const config = {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
            const response = await api.post(`/api/subscriptions/${id}`, updatedData, config)
            return response.data
        }catch(error){
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)


export const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    },
extraReducers: (builder) =>{
    builder
    .addCase(fetchSubscriptions.pending, (state)=> {
        state.loading = true;
        state.error = null;
    })
    .addCase(fetchSubscriptions.fulfilled, (state, action)=>{
        state.loading = false;
        state.subscriptions = action?.payload;
    })
    .addCase(fetchSubscriptions.rejected, (state, action)=>{
        state.loading = false;
        state.error = action.payload
    })
    .addCase(renewSubscription.pending, (state)=>{
        state.loading = true;
        state.error = null
    })
    .addCase(renewSubscription.fulfilled, (state, action)=>{
        state.loading = false
        state.subscription = action?.payload?.data
    })
    .addCase(renewSubscription.rejected, (state, action)=>{
        state.loading = false
        state.error = action.payload
    })
    .addCase(diactivateSubscription.pending, (state)=>{
        state.loading = true;
        state.error = null
    })
    .addCase(diactivateSubscription.fulfilled, (state, action)=>{
        state.loading = false
        // state.subscription = action?.payload?.data
    })
    .addCase(diactivateSubscription.rejected, (state, action)=>{
        state.loading = false
        state.error = action.payload
    })
    .addCase(createSubscription.pending, (state)=>{
        state.loading = true;
        state.error = null
    })
    .addCase(createSubscription.fulfilled, (state, action)=>{
        state.loading = false;
        state.subscriptions.push(action?.payload?.data)
    })
    .addCase(createSubscription.rejected, (state, action)=>{
        state.loading = false;
        state.error = action.payload;
    })
    .addCase(updateSubscription.pending, (state)=>{
        state.loading = true;
        state.error = null;
    })
    .addCase(updateSubscription.fulfilled, (state, action)=>{
        state.loading = false;
        state.subscription = action?.payload?.data;
    })
    .addCase(updateSubscription.rejected, (state, action)=>{
        state.loading = false;
        state.error = action.payload;
    })
}
})


export default subscriptionSlice.reducer