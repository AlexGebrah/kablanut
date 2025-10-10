import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type { MaterialsType, MaterialItem } from '../../components/typesComponents/MaterialsType'
import { BASE_URL } from '../../constants/UrlConstants'

// Async thunk to POST materials request to backend
export const createMaterialsRequest = createAsyncThunk(
  'materialsRequest/create',
  async (payload: MaterialsType, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const msg = (data && (data.message || data.error)) || 'Ошибка создания заявки на материалы'
        return rejectWithValue(msg)
      }
      return (data && Object.keys(data).length ? data : payload) as MaterialsType
    } catch (e) {
      return rejectWithValue((e as Error).message || 'Ошибка сети')
    }
  },
)

export interface MaterialsRequestState {
  form: MaterialsType
  loading?: boolean
  error?: string | null
}

const initialState: MaterialsRequestState = {
  form: {
    id: 'MRQ-0001',
    project: { id: '20250912oron' },
    user: {
      id: 'current',
      fullName: { firstName: 'User', lastName: '' } as any,
    } as any,
    items: [
      { materialName: 'Панель HPL', quantity: 10, unit: 'шт' },
    ],
    dateCreate: new Date().toISOString().slice(0, 10),
    status: 'draft',
  },
}

export type UpdateByPathPayload = { path: string; value: unknown }

const materialsRequestSlice = createSlice({
  name: 'materialsRequest',
  initialState,
  reducers: {
    setForm(state, action: PayloadAction<MaterialsType>) {
      state.form = action.payload
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
    addItem(state) {
      state.form.items = [...state.form.items, { materialName: '', quantity: 0, unit: '' }]
    },
    removeItem(state, action: PayloadAction<number>) {
      const index = action.payload
      state.form.items = state.form.items.filter((_, i) => i !== index)
    },
    updateItem<K extends keyof MaterialItem>(state: { index?: number; key?: keyof MaterialItem; value?: string | number; form?: any }, action: PayloadAction<{ index: number; key: K; value: MaterialItem[K] }>) {
      const { index, key, value } = action.payload
      const items = state.form.items.slice()
      items[index] = { ...items[index], [key]: value } as MaterialItem
      state.form.items = items
    },
    resetForm(state) {
      state.form = initialState.form
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMaterialsRequest.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createMaterialsRequest.fulfilled, (state, action) => {
        state.loading = false
        // If backend returns created entity, sync form with it
        if (action.payload) {
          state.form = action.payload
        }
      })
      .addCase(createMaterialsRequest.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || action.error.message || 'Ошибка'
      })
  },
})

export const { setForm, updateByPath, addItem, removeItem, updateItem, resetForm } = materialsRequestSlice.actions
export default materialsRequestSlice.reducer
