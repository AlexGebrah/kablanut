import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { SpecificationType } from '../../components/typesComponents/SpecificationType'

export interface ProjectPlanCreateState {
  projectId: string
  rows: SpecificationType[]
}

const newRow = (): SpecificationType => ({
  name: '',
  quantity: 0,
  unit: '',
  price: 0,
  currency: 'NIS',
})

const storageKey = (projectId: string) => `plan:${projectId}`

const safeLoad = (projectId: string): SpecificationType[] => {
  if (!projectId) return [newRow()]
  try {
    const raw = localStorage.getItem(storageKey(projectId))
    if (!raw) return [newRow()]
    const parsed = JSON.parse(raw) as SpecificationType[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [newRow()]
  } catch {
    return [newRow()]
  }
}

const safeSave = (projectId: string, rows: SpecificationType[]) => {
  if (!projectId) return
  try {
    localStorage.setItem(storageKey(projectId), JSON.stringify(rows))
  } catch {
    // ignore
  }
}

const initialState: ProjectPlanCreateState = {
  projectId: '',
  rows: [newRow()],
}

const projectPlanCreateSlice = createSlice({
  name: 'projectPlanCreate',
  initialState,
  reducers: {
    setProjectId(state, action: PayloadAction<string>) {
      state.projectId = action.payload
      // when projectId changes, load existing plan
      state.rows = safeLoad(state.projectId)
    },
    setRows(state, action: PayloadAction<SpecificationType[]>) {
      state.rows = action.payload
    },
    addRow(state) {
      state.rows.push(newRow())
    },
    removeRow(state, action: PayloadAction<number>) {
      state.rows = state.rows.filter((_, i) => i !== action.payload)
    },
    updateRow<K extends keyof SpecificationType>(
      state: { index?: number; field?: "name" | "quantity" | "unit" | "price" | "currency"; value?: string | number; rows?: any },
      action: PayloadAction<{ index: number; field: K; value: SpecificationType[K] }>
    ) {
      const { index, field, value } = action.payload
      const copy = state.rows[index] || newRow()
      state.rows[index] = { ...copy, [field]: value }
    },
    loadFromStorage(state) {
      state.rows = safeLoad(state.projectId)
    },
    saveToStorage(state) {
      safeSave(state.projectId, state.rows)
    },
    reset(state) {
      state.projectId = ''
      state.rows = [newRow()]
    },
  },
})

export const {
  setProjectId,
  setRows,
  addRow,
  removeRow,
  updateRow,
  loadFromStorage,
  saveToStorage,
  reset,
} = projectPlanCreateSlice.actions

export default projectPlanCreateSlice.reducer
