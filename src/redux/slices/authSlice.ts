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
// Async thunk for Google login
export const loginWithGoogle = createAsyncThunk(
    'auth/loginWithGoogle',
    async (_, { rejectWithValue }) => {
        try {
            // In a real app, this would initiate Google OAuth flow
            // For now, we'll simulate a successful login
            await new Promise((resolve) => setTimeout(resolve, 800))
            // Return mock user data for Google login
            return {
                email: 'user@gmail.com',
                name: 'Google User',
                provider: 'google',
            } as User
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return rejectWithValue('Ошибка входа через Google')
        }
    },
)
// Async thunk for Apple login
export const loginWithApple = createAsyncThunk(
    'auth/loginWithApple',
    async (_, { rejectWithValue }) => {
        try {
            // In a real app, this would initiate Apple OAuth flow
            // For now, we'll simulate a successful login
            await new Promise((resolve) => setTimeout(resolve, 800))
            // Return mock user data for Apple login
            return {
                email: 'user@icloud.com',
                name: 'Apple User',
                provider: 'apple',
            } as User
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return rejectWithValue('Ошибка входа через Apple')
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
        // Google login cases
        builder
            .addCase(loginWithGoogle.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(
                loginWithGoogle.fulfilled,
                (state, action: PayloadAction<User>) => {
                    state.isAuthenticated = true
                    state.user = action.payload
                    state.loading = false
                },
            )
            .addCase(loginWithGoogle.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
        // Apple login cases
        builder
            .addCase(loginWithApple.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(
                loginWithApple.fulfilled,
                (state, action: PayloadAction<User>) => {
                    state.isAuthenticated = true
                    state.user = action.payload
                    state.loading = false
                },
            )
            .addCase(loginWithApple.rejected, (state, action) => {
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
