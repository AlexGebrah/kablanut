import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type { ProjectType } from '../../components/typesComponents/ProjectType'
import { PROJECT_KIND_HPL } from '../../constants/TypeConstants'
import {BASE_URL} from "../../constants/UrlConstants.ts";


// POST /kablanut/project
export const createProject = createAsyncThunk(
  'createProject/create',
  async (payload: ProjectType, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/project`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        const msg = (data && (data.message || data.error)) || 'Ошибка создания проекта'
        return rejectWithValue(msg)
      }
      
      const data = await res.json()
      return data as ProjectType
    } catch (e) {
      return rejectWithValue((e as Error).message || 'Ошибка сети')
    }
  },
)

export interface CreateProjectState {
    form: ProjectType
    loading?: boolean
    error?: string | null
    
}

const initialState: CreateProjectState = {
  form: {
    id: '20250912oron',
    projectName: 'Oron',
    projectKind: PROJECT_KIND_HPL,
    projectDateStart: '2025-08-12',
    projectDateFinish: '2026-02-21',
    customer: 'Rav Barieh',
    manufacturer: 'Alucal',
    kablan: ['Rabinovich'],
    designer: 'MTM',
    executor: ['Oleg'],
    admin: 'Michael',
    projectStatus: 'draft',
    projectAddress: {
      city: '',
      street: '',
      house: '',
      zip: '',
      room: '',
    },
    specificationPlan: [
      {
        name: 'Площадь по плану',
        quantity: 400,
        unit: 'м2',
        price: 50,
        currency: 'NIS',
      },
    ],
    specificationFact: [
      {
        name: 'Площадь факт',
        quantity: 100,
        unit: 'м2',
        price: 50,
        currency: 'NIS',
      },
    ],
  },
}

// Generic path-based update like "projectAddress.city" or "kablan"
export type UpdateByPathPayload = { path: string; value: unknown }

const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj))

const createProjectSlice = createSlice({
  name: 'createProject',
  initialState,
  reducers: {
    setForm(state, action: PayloadAction<ProjectType>) {
      state.form = deepClone(action.payload)
    },
    updateByPath(state, action: PayloadAction<UpdateByPathPayload>) {
      const { path, value } = action.payload
      const parts = path.split('.')
      // Create a shallow-cloned tree along the path to keep immutability
      // but since we're using RTK+Immer, we can mutate directly
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
})

export const { setForm, updateByPath, resetForm } = createProjectSlice.actions
export default createProjectSlice.reducer
