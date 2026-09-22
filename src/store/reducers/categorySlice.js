import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/baseUrl";

const initialState = {
  categories: [],
  homeCategories: [],
//   profile: null,
  loading: false,
  error:null,
};

export const fetchCategories = createAsyncThunk(
    "category/fetchCategories",
    async (_, {getState, rejectWithValue}) => {
        try{
            const token = getState().auth.token;
            const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              };
            const response = await api.get(`/api/activities`, config)
            return response.data
        }catch (error){
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const fetchHomeCategories = createAsyncThunk(
    "category/fetchHomeCategories",
    async (_, {getState, rejectWithValue}) => {
        try{
            const token = getState().auth.token;
            const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              };
            const response = await api.get(`/api/home/activities`, config)
            return response.data
        }catch (error){
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)


export const createCategory = createAsyncThunk(
    "/category/createCategory",
    async (categoryData,{rejectWithValue, getState})=>{
        try{
            const token = getState().auth.token;
            const config = {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
            const response = await api.post(`/api/activities`, categoryData, config)
            return response.data
        }catch(error){
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

export const updateCategory = createAsyncThunk(
    "/category/updateCategory",
    async({id, newCategoryData}, {rejectWithValue, getState})=>{
        try{
            const token = getState().auth.token;
            const config = {
                headers: 
                {
                    Authorization : `Bearer ${token}`
                }
            }
            const response = await api.post(`/api/activities/${id}`, newCategoryData, config);
            return response.data
        } catch(error){
            return rejectWithValue(error.response.data || error.message)
        }
    }
)
export const deleteCategory = createAsyncThunk(
    "/category/deleteCategory",
    async(id, {rejectWithValue, getState})=>{
        try{
            const token = getState().auth.token;
            const config = {
                headers: 
                {
                    Authorization : `Bearer ${token}`
                }
            }
             const response = await api.delete(`/api/activities/${id}`, config);
            return response?.data;
        } catch(error){
            return rejectWithValue(error.response.data || error.message)
        }
    }
)

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    },
extraReducers: (builder) =>{
    builder
    .addCase(fetchCategories.pending, (state)=> {
        state.loading = true;
        state.error = null;
    })
    .addCase(fetchCategories.fulfilled, (state, action)=>{
        state.loading = false;
        state.categories = action?.payload?.activities;
    })
    .addCase(fetchCategories.rejected, (state, action)=>{
        state.loading = false;
        state.error = action.payload
    })
    .addCase(fetchHomeCategories.pending, (state)=> {
        state.loading = true;
        state.error = null;
    })
    .addCase(fetchHomeCategories.fulfilled, (state, action)=>{
        state.loading = false;
        state.homeCategories = action?.payload;
    })
    .addCase(fetchHomeCategories.rejected, (state, action)=>{
        state.loading = false;
        state.error = action.payload
    })
    .addCase(createCategory.pending, (state)=>{
        state.loading = true;
        state.error = null
    })
    .addCase(createCategory.fulfilled, (state, action)=>{
        state.loading = false;
        //state.categories.push(action?.payload?.data)
    })
    .addCase(createCategory.rejected, (state, action)=>{
        state.loading = false;
        state.error = action.payload;
    })
    .addCase(updateCategory.pending, (state)=>{
        state.loading = true;
        state.error = null;
    })
    .addCase(updateCategory.fulfilled, (state)=>{
        state.loading = false;
    })
    .addCase(updateCategory.rejected, (state, action)=>{
        state.loading = false;
        state.error = action.payload
    })
    .addCase(deleteCategory.pending, (state)=>{
        state.loading = true;
        state.error = null;
    })
    .addCase(deleteCategory.fulfilled, (state, action)=>{
        state.loading = false;
        // state.profiles = state.profiles.filter((selected)=>selected.id != action.payload)
    })
    .addCase(deleteCategory.rejected, (state, action)=>{
        state.loading = false;
        state.error = action.payload
    })
}
})


export default categorySlice.reducer