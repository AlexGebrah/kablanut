import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import authCreateUserReducer from './slices/createUserSlice.ts'
import createProjectReducer from './slices/createProjectSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        authCreateUser: authCreateUserReducer,
        createProject: createProjectReducer,
    },
})
export type AppDispatch = typeof store.dispatch