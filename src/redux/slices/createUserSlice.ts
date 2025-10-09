import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type { UserType } from '../../components/typesComponents/UserType'

const BASE_URL = 'http://localhost:8080/kablanut'

export interface AuthCreateUserState {
  data: UserType | null
  loading: boolean
  error: string | null
}

const initialState: AuthCreateUserState = {
  data: null,
  loading: false,
  error: null,
}

export const createUser = createAsyncThunk(
  'authCreateUser/createUser',
  async (payload: UserType, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const msg = (data && (data.message || data.error)) || 'Ошибка создания пользователя'
        return rejectWithValue(msg)
      }
      // Assume API returns the created user; fallback to the sent payload
      return (data && Object.keys(data).length ? data : payload) as UserType
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
    },
    resetCreateUser: (state) => {
      state.data = null
      state.loading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<UserType>) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearCreateUserError, resetCreateUser } = authCreateUserSlice.actions
export default authCreateUserSlice.reducer
