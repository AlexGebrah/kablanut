import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type {AuthState, User} from '../types';
// Initial state
const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
}
// Async thunk for login
export const loginUser = createAsyncThunk(
    'auth/login',
    async (
        { email }: { email: string; password: string },
        { rejectWithValue },
    ) => {
        try {
            // In a real app, this would be an API call
            // For now, we'll simulate a successful login if email contains '@'
            if (!email.includes('@')) {
                throw new Error('Неверный email')
            }
            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 500))
            // Return mock user data
            return { email, name: email.split('@')[0] } as User
        } catch (error) {
            return rejectWithValue((error as Error).message)
        }
    },
)
// Async thunk for registration
export const registerUser = createAsyncThunk(
    'auth/register',
    async (
        {
            name,
            email,
        }: { name: string; email: string; password: string },
        { rejectWithValue },
    ) => {
        try {
            // In a real app, this would be an API call
            // For now, we'll simulate a successful registration if email contains '@'
            if (!email.includes('@')) {
                throw new Error('Неверный email')
            }
            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 500))
            // Return mock user data
            return { email, name } as User
        } catch (error) {
            return rejectWithValue((error as Error).message)
        }
    },
)
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false
            state.user = null
        },
        clearError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        // Login cases
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.isAuthenticated = true
                state.user = action.payload
                state.loading = false
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
        // Register cases
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.isAuthenticated = true
                state.user = action.payload
                state.loading = false
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})
export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
