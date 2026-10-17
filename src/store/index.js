import { configureStore } from '@reduxjs/toolkit'
import  authSlice  from './reducers/auth/authSlice';
import Cookies from "js-cookie";
import profileSlice  from './reducers/profileSlice';
import  categorySlice  from './reducers/categorySlice';
import subscriptionSlice from './reducers/subscriptionSlice';
import notificationSlice from './reducers/notificationSlice';
import settingsSlice from './reducers/settingsSlice';

const preloadedState = {
  auth: {
    token: Cookies.get("token") || localStorage.getItem("token") || null,
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
            settings: settingsSlice,
        },
        preloadedState,
    }
)

export default store;