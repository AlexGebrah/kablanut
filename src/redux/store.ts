import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import authCreateUserReducer from './slices/authCreateUser'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        authCreateUser: authCreateUserReducer,
    },
})
export type AppDispatch = typeof store.dispatch