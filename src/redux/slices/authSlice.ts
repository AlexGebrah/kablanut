import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type {AuthState, User} from '../types';

const BASE_URL = 'http://localhost:8080/kablanut'

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
        { email, password }: { email: string; password: string },
        { rejectWithValue },
    ) => {
        try {
            const res = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
                const msg = (data && (data.message || data.error)) || 'Ошибка входа'
                return rejectWithValue(msg)
            }
            // Expecting API to return user object (possibly with token). We'll map minimally.
            const user: User = {
                id: data.id,
                name: data.name,
                email: data.email ?? email,
            }
            return user
        } catch (error) {
            return rejectWithValue((error as Error).message || 'Ошибка сети')
        }
    },
)
// Async thunk for Google login
export const loginWithGoogle = createAsyncThunk(
    'auth/loginWithGoogle',
    async (_, { rejectWithValue }) => {
        try {
            // Keeping mock implementation as backend flow may vary
            await new Promise((resolve) => setTimeout(resolve, 800))
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
            // Keeping mock implementation as backend flow may vary
            await new Promise((resolve) => setTimeout(resolve, 800))
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
            password,
        }: { name: string; email: string; password: string },
        { rejectWithValue },
    ) => {
        try {
            const res = await fetch(`${BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
                const msg = (data && (data.message || data.error)) || 'Ошибка регистрации'
                return rejectWithValue(msg)
            }
            const user: User = {
                id: data.id,
                name: data.name ?? name,
                email: data.email ?? email,
            }
            return user
        } catch (error) {
            return rejectWithValue((error as Error).message || 'Ошибка сети')
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
