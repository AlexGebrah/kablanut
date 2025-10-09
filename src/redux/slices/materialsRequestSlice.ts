import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { MaterialsType, MaterialItem } from '../../components/typesComponents/MaterialsType'

export interface MaterialsRequestState {
  form: MaterialsType
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
    updateItem<K extends keyof MaterialItem>(state, action: PayloadAction<{ index: number; key: K; value: MaterialItem[K] }>) {
      const { index, key, value } = action.payload
      const items = state.form.items.slice()
      items[index] = { ...items[index], [key]: value } as MaterialItem
      state.form.items = items
    },
    resetForm(state) {
      state.form = initialState.form
    },
  },
})

export const { setForm, updateByPath, addItem, removeItem, updateItem, resetForm } = materialsRequestSlice.actions
export default materialsRequestSlice.reducer
