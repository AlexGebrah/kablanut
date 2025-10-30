// typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { UserType } from '../../components/typesComponents/UserType'
import { BASE_URL } from '../../constants/UrlConstants.ts'
import { secureFetch } from './authSlice'

// Локальная корректная типизация состояния (boolean вместо literal false)
interface AuthCreateUserStateLocal {
    data: UserType | null
    loading: boolean
    error: string | null
    searchedUser: UserType | null
    searchLoading: boolean
    searchError: string | null
}

const initialState: AuthCreateUserStateLocal = {
    data: null,
    loading: false,
    error: null,
    searchedUser: null,
    searchLoading: false,
    searchError: null,
}

export const createUser = createAsyncThunk(
    'authCreateUser/createUser',
    async (payload: UserType, { rejectWithValue }) => {
        try {
            const res = await fetch(`${BASE_URL}/user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
                const msg = (data && (data.message || data.error)) || 'Ошибка создания пользователя'
                return rejectWithValue(msg)
            }
            return (data && Object.keys(data).length ? data : payload) as UserType
        } catch (e) {
            return rejectWithValue((e as Error).message || 'Ошибка сети')
        }
    },
)

export const searchUserById = createAsyncThunk(
    'authCreateUser/searchUserById',
    async (userId: string, { rejectWithValue }) => {
        try {
            const res = await secureFetch(`${BASE_URL}/user/${userId}`)

            if (!res.ok) {
                if (res.status === 404) {
                    return rejectWithValue('Пользователь не найден')
                }
                const data = await res.json().catch(() => ({}))
                const msg = data?.message || data?.error || 'Ошибка поиска пользователя'
                return rejectWithValue(msg)
            }

            const data = await res.json()
            return data as UserType
        } catch (e) {
            return rejectWithValue((e as Error).message || 'Ошибка сети')
        }
    },
)

export const updateUser = createAsyncThunk(
    'authCreateUser/updateUser',
    async (payload: UserType, { rejectWithValue }) => {
        try {
            const res = await secureFetch(`${BASE_URL}/user/${payload.id}`, {
                method: 'PUT',
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                const msg = data?.message || data?.error || 'Ошибка обновления пользователя'
                return rejectWithValue(msg)
            }

            const data = await res.json()
            return data as UserType
        } catch (e) {
            return rejectWithValue((e as Error).message || 'Ошибка сети')
        }
    },
)

export const deleteUser = createAsyncThunk(
    'authCreateUser/deleteUser',
    async (userId: string, { rejectWithValue }) => {
        try {
            const res = await secureFetch(`${BASE_URL}/user/${userId}`, {
                method: 'DELETE',
            })

            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                const msg = data?.message || data?.error || 'Ошибка удаления пользователя'
                return rejectWithValue(msg)
            }

            return userId
        } catch (e) {
            return rejectWithValue((e as Error).message || 'Ошибка сети')
        }
    },
)

const authCreateUserSlice = createSlice({
    name: 'authCreateUser',
    initialState,
    reducers: {
        clearCreateUserError: (state) => {
            state.error = null
            state.searchError = null
        },
        resetCreateUser: (state) => {
            state.data = null
            state.loading = false
            state.error = null
        },
        clearSearchedUser: (state) => {
            state.searchedUser = null
            state.searchError = null
        },
    },

    extraReducers: (builder) => {
        // Create user
        builder
            .addCase(createUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false
                state.error = (action.payload as string) || action.error.message || 'Ошибка создания'
            })

        // Search user
        builder
            .addCase(searchUserById.pending, (state) => {
                state.searchLoading = true
                state.searchError = null
            })
            .addCase(searchUserById.fulfilled, (state, action) => {
                state.searchLoading = false
                state.searchedUser = action.payload
            })
            .addCase(searchUserById.rejected, (state, action) => {
                state.searchLoading = false
                state.searchError = (action.payload as string) || action.error.message || 'Ошибка поиска'
            })

        // Update user
        builder
            .addCase(updateUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
                state.searchedUser = action.payload
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false
                state.error = (action.payload as string) || action.error.message || 'Ошибка обновления'
            })

        // Delete user
        builder
            .addCase(deleteUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(deleteUser.fulfilled, (state) => {
                state.loading = false
                state.data = null
                state.searchedUser = null
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false
                state.error = (action.payload as string) || action.error.message || 'Ошибка удаления'
            })
    },
})

export const { clearCreateUserError, resetCreateUser, clearSearchedUser } = authCreateUserSlice.actions
export default authCreateUserSlice.reducer
