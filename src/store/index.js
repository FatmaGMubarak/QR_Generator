import { configureStore } from '@reduxjs/toolkit'
import  authSlice  from './reducers/auth/authSlice';
import Cookies from "js-cookie";
import profileSlice  from './reducers/profileSlice';
import  categorySlice  from './reducers/categorySlice';
import subscriptionSlice from './reducers/subscriptionSlice';
import notificationSlice from './reducers/notificationSlice';

const preloadedState = {
  auth: {
    token: Cookies.get("token") || sessionStorage.getItem("token") || null,
    loading: false,
    error: null,
  },
};

const store = configureStore(
    {
        reducer:{
            auth:authSlice,
            profile:profileSlice,
            category:categorySlice,
            subscription: subscriptionSlice,
            notification: notificationSlice,
        },
        preloadedState,
    }
)

export default store;