import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import authCreateUserReducer from './slices/createUserSlice.ts'
import createProjectReducer from './slices/createProjectSlice'
import materialsRequestReducer from './slices/materialsRequestSlice'
import problemsRequestReducer from './slices/problemsRequestSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        authCreateUser: authCreateUserReducer,
        createProject: createProjectReducer,
        materialsRequest: materialsRequestReducer,
        problemsRequest: problemsRequestReducer,
    },
})
export type AppDispatch = typeof store.dispatch