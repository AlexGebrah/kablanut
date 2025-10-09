import reducer, {
  setProjectId,
  setReportDate,
  addRow,
  removeRow,
  updateRow,
  selectName,
  loadPlanFromStorage,
  loadFactFromStorage,
  saveFactToStorage,
  reset,
} from '../projectFactCreateSlice'
import type { ProjectFactCreateState } from '../../types'
import { describe, it, expect, beforeEach, vi } from 'vitest'

const getInitial = (): ProjectFactCreateState =>
  reducer(undefined as unknown as ProjectFactCreateState, { type: '@@INIT' })

const planKey = (projectId: string) => `plan:${projectId}`
const factKey = (projectId: string, reportDate: string) => `fact:${projectId}:${reportDate}`

const samplePlan = [
  { name: 'Tile', quantity: 100, unit: 'm2', price: 50, currency: 'NIS' },
  { name: 'Paint', quantity: 20, unit: 'ltr', price: 30, currency: 'USD' },
]

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('projectFactCreateSlice', () => {
  it('should return initial state on first run', () => {
    const s = getInitial()
    expect(s.projectId).toBe('')
    expect(s.reportDate).toBe('')
    expect(s.planItems).toEqual([])
    expect(s.rows).toHaveLength(1)
    expect(s.rows[0]).toMatchObject({ name: '', quantity: 0, unit: '', price: 0, currency: 'NIS' })
  })

  it('setProjectId should load plan from localStorage and keep one empty row if no reportDate', () => {
    localStorage.setItem(planKey('p1'), JSON.stringify(samplePlan))
    const prev = getInitial()
    const next = reducer(prev, setProjectId('p1'))
    expect(next.projectId).toBe('p1')
    expect(next.planItems).toEqual(samplePlan)
    expect(next.rows).toHaveLength(1)
  })

  it('setReportDate should load fact rows for project/reportDate', () => {
    const rows = [
      { name: 'Tile', quantity: 10, unit: 'm2', price: 50, currency: 'NIS' },
      { name: 'Paint', quantity: 5, unit: 'ltr', price: 30, currency: 'USD' },
    ]
    localStorage.setItem(factKey('p2', '2025-02-01'), JSON.stringify(rows))

    let state = getInitial()
    state = reducer(state, setProjectId('p2'))
    // still one row because no date yet
    expect(state.rows).toHaveLength(1)

    state = reducer(state, setReportDate('2025-02-01'))
    expect(state.reportDate).toBe('2025-02-01')
    expect(state.rows).toEqual(rows)
  })

  it('addRow and removeRow should modify rows correctly', () => {
    let state = getInitial()
    state = reducer(state, addRow())
    state = reducer(state, addRow())
    expect(state.rows).toHaveLength(3)
    // remove middle row (index 1)
    state = reducer(state, removeRow(1))
    expect(state.rows).toHaveLength(2)
  })

  it('updateRow should update a field by index', () => {
    let state = getInitial()
    state = reducer(state, updateRow({ index: 0, field: 'quantity', value: 42 }))
    expect(state.rows[0].quantity).toBe(42)
    state = reducer(state, updateRow({ index: 0, field: 'name', value: 'Tile' }))
    expect(state.rows[0].name).toBe('Tile')
  })

  it('selectName should copy attributes from plan item with same name', () => {
    localStorage.setItem(planKey('p3'), JSON.stringify(samplePlan))
    let state = getInitial()
    state = reducer(state, setProjectId('p3'))
    // before selection
    expect(state.rows[0]).toMatchObject({ name: '', unit: '', price: 0, currency: 'NIS' })

    state = reducer(state, selectName({ index: 0, name: 'Paint' }))
    expect(state.rows[0]).toMatchObject({ name: 'Paint', unit: 'ltr', price: 30, currency: 'USD' })
  })

  it('loadPlanFromStorage and loadFactFromStorage should refresh from storage', () => {
    localStorage.setItem(planKey('p4'), JSON.stringify(samplePlan))
    const factRows = [{ name: 'Tile', quantity: 7, unit: 'm2', price: 50, currency: 'NIS' }]
    localStorage.setItem(factKey('p4', '2025-03-01'), JSON.stringify(factRows))

    let state = getInitial()
    state = reducer(state, setProjectId('p4'))
    state = reducer(state, setReportDate('2025-03-01'))

    // Clear and then call loaders to ensure they read from storage
    state = reducer(state, loadPlanFromStorage())
    state = reducer(state, loadFactFromStorage())
    expect(state.planItems).toEqual(samplePlan)
    expect(state.rows).toEqual(factRows)
  })

  it('saveFactToStorage should write current rows to localStorage', () => {
    let state = getInitial()
    state = reducer(state, setProjectId('p5'))
    state = reducer(state, setReportDate('2025-04-01'))
    state = reducer(state, updateRow({ index: 0, field: 'name', value: 'Tile' }))
    state = reducer(state, updateRow({ index: 0, field: 'quantity', value: 9 }))

    reducer(state, saveFactToStorage())

    const saved = localStorage.getItem(factKey('p5', '2025-04-01'))
    expect(saved).toBe(JSON.stringify(state.rows))
  })

  it('reset should restore initial state', () => {
    let state = getInitial()
    state = reducer(state, setProjectId('p7'))
    state = reducer(state, setReportDate('2025-05-01'))
    state = reducer(state, addRow())
    expect(state.rows.length).toBeGreaterThan(1)

    state = reducer(state, reset())
    const initial = getInitial()
    expect(state).toEqual(initial)
  })
})
