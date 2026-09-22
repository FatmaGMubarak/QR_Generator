import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/baseUrl";

const initialState = {
  profiles: [],
  homeProfiles: [],
  profile: null,
  loading: false,
  error:null,
};

export const fetchProfiles = createAsyncThunk(
    "profile/fetchProfiles",
    async (_, {getState, rejectWithValue}) => {
        try{
            const token = getState().auth.token;
            const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              };
            const response = await api.get(`/api/profiles`, config)
            return response.data
        }catch (error){
            return rejectWithValue(error.response?.data || error.message)
        }
    }
);

export const fetchHomeProfiles = createAsyncThunk(
    "profile/fetchHomeProfiles",
    async (_, {getState, rejectWithValue}) => {
        try{
            const token = getState().auth.token;
            const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              };
            const response = await api.get(`/api/home/profiles`, config)
            return response.data
        }catch (error){
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const fetchProfileById = createAsyncThunk(
    "profile/fetchProfileById",
    async (slug, {rejectWithValue, getState})=>{
        try{
            const token = getState().auth.token;
            const config = {
                headers:{
                    Authorization :`Bearer ${token}`,
                }
            }
            const response = await api.get(`/api/profiles/${slug}`, config)
            return response.data
        }catch(error){
            return rejectWithValue (error.response?.data || error.message)
        }
    }
)

export const createProfile = createAsyncThunk(
    "/profile/createProfile",
    async (profileData,{rejectWithValue, getState})=>{
        try{
            const token = getState().auth.token;
            const config = {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
            const response = await api.post(`/api/profiles`, profileData, config)
            return response.data
        }catch(error){
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const updateProfile= createAsyncThunk(
    "/profile/updateProfile",
    async({slug, newProfileData}, {rejectWithValue, getState})=>{
        try{
            const token = getState().auth.token;
            const config = {
                headers: 
                {
                    Authorization : `Bearer ${token}`
                }
            }
            const response = await api.post(`/api/profiles/${slug}`, newProfileData, config);
            return response.data
        } catch(error){
            return rejectWithValue(error.response.data || error.message)
        }
    }
)
export const deleteProfile = createAsyncThunk(
    "/profile/deleteProfile",
    async(slug, {rejectWithValue, getState})=>{
        try{
            const token = getState().auth.token;
            const config = {
                headers: 
                {
                    Authorization : `Bearer ${token}`
                }
            }
             const response = await api.delete(`/api/profiles/${slug}`, config);
            return response?.data;
        } catch(error){
            return rejectWithValue(error.response.data || error.message)
        }
    }
)

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    },
extraReducers: (builder) =>{
    builder
    .addCase(fetchProfiles.pending, (state)=> {
        state.loading = true;
        state.error = null;
    })
    .addCase(fetchProfiles.fulfilled, (state, action)=>{
        state.loading = false;
        state.profiles = action?.payload?.data;
    })
    .addCase(fetchProfiles.rejected, (state, action)=>{
        state.loading = false;
        state.error = action.payload
    })
    .addCase(fetchHomeProfiles.pending, (state)=> {
        state.loading = true;
        state.error = null;
    })
    .addCase(fetchHomeProfiles.fulfilled, (state, action)=>{
        state.loading = false;
        state.homeProfiles = action?.payload;
    })
    .addCase(fetchHomeProfiles.rejected, (state, action)=>{
        state.loading = false;
        state.error = action.payload
    })
    .addCase(fetchProfileById.pending, (state)=>{
        state.loading = true;
        state.error = null
    })
    .addCase(fetchProfileById.fulfilled, (state, action)=>{
        state.loading = false
        state.profile = action?.payload?.data
    })
    .addCase(fetchProfileById.rejected, (state, action)=>{
        state.loading = false
        state.error = action.payload
    })
    .addCase(createProfile.pending, (state)=>{
        state.loading = true;
        state.error = null
    })
    .addCase(createProfile.fulfilled, (state, action)=>{
        state.loading = false;
        state.profiles.push(action?.payload?.data)
    })
    .addCase(createProfile.rejected, (state, action)=>{
        state.loading = false;
        state.error = action.payload;
    })
    .addCase(updateProfile.pending, (state)=>{
        state.loading = true;
        state.error = null;
    })
    .addCase(updateProfile.fulfilled, (state)=>{
        state.loading = false;
    })
    .addCase(updateProfile.rejected, (state, action)=>{
        state.loading = false;
        state.error = action.payload
    })
    .addCase(deleteProfile.pending, (state)=>{
        state.loading = true;
        state.error = null;
    })
    .addCase(deleteProfile.fulfilled, (state, action)=>{
        state.loading = false;
        // state.profiles = state.profiles.filter((selected)=>selected.id != action.payload)
    })
    .addCase(deleteProfile.rejected, (state, action)=>{
        state.loading = false;
        state.error = action.payload
    })
}
})


export default profileSlice.reducer