import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { SpecificationType } from '../../components/typesComponents/SpecificationType'

export type FactRow = SpecificationType

export interface ProjectFactCreateState {
  projectId: string
  reportDate: string
  planItems: SpecificationType[]
  rows: FactRow[]
}

const newRow = (): FactRow => ({
  name: '',
  quantity: 0,
  unit: '',
  price: 0,
  currency: 'NIS',
})

const planStorageKey = (projectId: string) => `plan:${projectId}`
const factStorageKey = (projectId: string, reportDate: string) => `fact:${projectId}:${reportDate}`

const safeLoadPlan = (projectId: string): SpecificationType[] => {
  if (!projectId) return []
  try {
    const raw = localStorage.getItem(planStorageKey(projectId))
    if (!raw) return []
    const parsed = JSON.parse(raw) as SpecificationType[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const safeLoadFact = (projectId: string, reportDate: string): FactRow[] => {
  if (!projectId || !reportDate) return [newRow()]
  try {
    const raw = localStorage.getItem(factStorageKey(projectId, reportDate))
    if (!raw) return [newRow()]
    const parsed = JSON.parse(raw) as FactRow[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [newRow()]
  } catch {
    return [newRow()]
  }
}

const safeSaveFact = (projectId: string, reportDate: string, rows: FactRow[]) => {
  if (!projectId || !reportDate) return
  try {
    localStorage.setItem(factStorageKey(projectId, reportDate), JSON.stringify(rows))
  } catch {
    // ignore
  }
}

const initialState: ProjectFactCreateState = {
  projectId: '',
  reportDate: '',
  planItems: [],
  rows: [newRow()],
}

const projectFactCreateSlice = createSlice({
  name: 'projectFactCreate',
  initialState,
  reducers: {
    setProjectId(state, action: PayloadAction<string>) {
      state.projectId = action.payload
      // reload plan and, if reportDate specified, load fact rows
      state.planItems = safeLoadPlan(state.projectId)
      state.rows = safeLoadFact(state.projectId, state.reportDate)
    },
    setReportDate(state, action: PayloadAction<string>) {
      state.reportDate = action.payload
      state.rows = safeLoadFact(state.projectId, state.reportDate)
    },
    setRows(state, action: PayloadAction<FactRow[]>) {
      state.rows = action.payload
    },
    addRow(state) {
      state.rows.push(newRow())
    },
    removeRow(state, action: PayloadAction<number>) {
      state.rows = state.rows.filter((_, i) => i !== action.payload)
    },
    updateRow<K extends keyof FactRow>(
      state: { index?: number; field?: "name" | "quantity" | "unit" | "price" | "currency"; value?: string | number; rows?: any },
      action: PayloadAction<{ index: number; field: K; value: FactRow[K] }>
    ) {
      const { index, field, value } = action.payload
      const current = state.rows[index] || newRow()
      state.rows[index] = { ...current, [field]: value }
    },
    selectName(state, action: PayloadAction<{ index: number; name: string }>) {
      const { index, name } = action.payload
      const planSample = state.planItems.find(p => p.name === name)
      const current = state.rows[index] || newRow()
      state.rows[index] = {
        ...current,
        name,
        unit: planSample?.unit ?? current.unit,
        price: planSample?.price ?? current.price,
        currency: planSample?.currency ?? current.currency,
      }
    },
    loadPlanFromStorage(state) {
      state.planItems = safeLoadPlan(state.projectId)
    },
    loadFactFromStorage(state) {
      state.rows = safeLoadFact(state.projectId, state.reportDate)
    },
    saveFactToStorage(state) {
      safeSaveFact(state.projectId, state.reportDate, state.rows)
    },
    reset(state) {
      state.projectId = ''
      state.reportDate = ''
      state.planItems = []
      state.rows = [newRow()]
    },
  },
})

export const {
  setProjectId,
  setReportDate,
  setRows,
  addRow,
  removeRow,
  updateRow,
  selectName,
  loadPlanFromStorage,
  loadFactFromStorage,
  saveFactToStorage,
  reset,
} = projectFactCreateSlice.actions

export default projectFactCreateSlice.reducer
