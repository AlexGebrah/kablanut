import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type { AlarmType } from '../../components/typesComponents/AlarmType'
import { BASE_URL } from '../../constants/UrlConstants'

// Async thunk to POST problem (alarm) request to backend
export const createProblemRequest = createAsyncThunk(
  'problemsRequest/create',
  async (payload: AlarmType, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/problems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const msg = (data && (data.message || data.error)) || 'Ошибка создания заявки на проблему'
        return rejectWithValue(msg)
      }
      return (data && Object.keys(data).length ? data : payload) as AlarmType
    } catch (e) {
      return rejectWithValue((e as Error).message || 'Ошибка сети')
    }
  },
)

export interface ProblemsRequestState {
  form: AlarmType
  loading?: boolean
  error?: string | null
}

const initialState: ProblemsRequestState = {
  form: {
    id: 'ALM-0001',
    project: { id: '20250912oron', projectName: 'Oron' },
    user: {
      id: 'current',
      fullName: { firstName: 'User', lastName: '' },
    },
    dateCreate: new Date().toISOString().slice(0, 10),
    status: 'draft',
    title: 'other',
    description: '',
  },
  loading: false,
  error: null,
}

export type UpdateByPathPayload = { path: string; value: unknown }

const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj))

const problemsRequestSlice = createSlice({
  name: 'problemsRequest',
  initialState,
  reducers: {
    setForm(state, action: PayloadAction<AlarmType>) {
      // assign a cloned form to avoid carrying external object references
      state.form = deepClone(action.payload)
    },
    updateByPath(state, action: PayloadAction<UpdateByPathPayload>) {
      const { path, value } = action.payload
      const parts = path.split('.')
      let cursor: any = state.form as any
      for (let i = 0; i < parts.length - 1; i++) {
        const key = parts[i]
        if (Array.isArray(cursor[key])) {
          cursor[key] = [...cursor[key]]
        } else if (typeof cursor[key] === 'object' && cursor[key] !== null) {
          cursor[key] = { ...cursor[key] }
        }
        cursor = cursor[key]
      }
      cursor[parts[parts.length - 1]] = value as any
    },
    resetForm(state) {
      state.form = deepClone(initialState.form)
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProblemRequest.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createProblemRequest.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload) {
          state.form = action.payload
        }
      })
      .addCase(createProblemRequest.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || action.error.message || 'Ошибка'
      })
  },
})

export const { setForm, updateByPath, resetForm } = problemsRequestSlice.actions
export default problemsRequestSlice.reducer
