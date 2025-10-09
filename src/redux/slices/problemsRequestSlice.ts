import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AlarmType } from '../../components/typesComponents/AlarmType'

export interface ProblemsRequestState {
  form: AlarmType
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
}

export type UpdateByPathPayload = { path: string; value: unknown }

const problemsRequestSlice = createSlice({
  name: 'problemsRequest',
  initialState,
  reducers: {
    setForm(state, action: PayloadAction<AlarmType>) {
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
    resetForm(state) {
      state.form = initialState.form
    },
  },
})

export const { setForm, updateByPath, resetForm } = problemsRequestSlice.actions
export default problemsRequestSlice.reducer
