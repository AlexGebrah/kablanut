import reducer, {
  setProjectId,
  setRows,
  addRow,
  removeRow,
  updateRow,
  loadFromStorage,
  saveToStorage,
  reset,
} from '../../redux/slices/projectPlanCreateSlice.ts'
import type { ProjectPlanCreateState } from '../../redux/types.ts'
import type { SpecificationType } from '../../components/typesComponents/SpecificationType.ts'
import { describe, it, expect, beforeEach } from 'vitest'

const getInitial = (): ProjectPlanCreateState =>
  reducer(undefined as unknown as ProjectPlanCreateState, { type: '@@INIT' })

const makeRow = (overrides: Partial<SpecificationType> = {}): SpecificationType => ({
  name: 'Item',
  quantity: 1,
  unit: 'pcs',
  price: 100,
  currency: 'NIS',
  ...overrides,
})

describe('projectPlanCreateSlice', () => {
  beforeEach(() => {
    // ensure clean storage between tests
    localStorage.clear()
  })

  it('should return initial state on first run', () => {
    const state = getInitial()
    expect(state.projectId).toBe('')
    expect(Array.isArray(state.rows)).toBe(true)
    expect(state.rows.length).toBe(1)
    expect(state.rows[0]).toEqual({ name: '', quantity: 0, unit: '', price: 0, currency: 'NIS' })
  })

  it('setProjectId should set id and attempt to load from storage', () => {
    const data = [makeRow({ name: 'Saved' })]
    localStorage.setItem('plan:abc', JSON.stringify(data))

    const s1 = getInitial()
    const s2 = reducer(s1, setProjectId('abc'))
    expect(s2.projectId).toBe('abc')
    expect(s2.rows).toEqual(data)
  })

  it('setRows should replace rows', () => {
    const s1 = getInitial()
    const rows = [makeRow({ name: 'A' }), makeRow({ name: 'B' })]
    const s2 = reducer(s1, setRows(rows))
    expect(s2.rows).toEqual(rows)
  })

  it('addRow should append a blank row', () => {
    const s1 = getInitial()
    const s2 = reducer(s1, addRow())
    expect(s2.rows.length).toBe(2)
    expect(s2.rows[1]).toEqual({ name: '', quantity: 0, unit: '', price: 0, currency: 'NIS' })
  })

  it('removeRow should remove row by index', () => {
    const s1 = reducer(getInitial(), setRows([makeRow({ name: 'A' }), makeRow({ name: 'B' })]))
    const s2 = reducer(s1, removeRow(0))
    expect(s2.rows).toEqual([makeRow({ name: 'B' })])
  })

  it('updateRow should update a field of specific row', () => {
    const s1 = reducer(getInitial(), setRows([makeRow({ name: 'X' })]))
    const s2 = reducer(s1, updateRow({ index: 0, field: 'name', value: 'Y' }))
    expect(s2.rows[0].name).toBe('Y')
    // previous state row intact (immer)
    expect(s1.rows[0].name).toBe('X')
  })

  it('saveToStorage should persist rows for current projectId', () => {
    const rows = [makeRow({ name: 'Persist' })]
    let s = reducer(getInitial(), setProjectId('p1'))
    s = reducer(s, setRows(rows))
    reducer(s, saveToStorage())
    const raw = localStorage.getItem('plan:p1')
    expect(raw).toBe(JSON.stringify(rows))
  })

  it('loadFromStorage should load saved rows', () => {
    const rows = [makeRow({ name: 'LoadMe' })]
    localStorage.setItem('plan:p2', JSON.stringify(rows))
    let s = reducer(getInitial(), setProjectId('p2'))
    // mutate rows to something else
    s = reducer(s, setRows([makeRow({ name: 'Other' })]))
    const s2 = reducer(s, loadFromStorage())
    expect(s2.rows).toEqual(rows)
  })

  it('reset should clear projectId and set single blank row', () => {
    let s = reducer(getInitial(), setProjectId('p3'))
    s = reducer(s, addRow())
    const s2 = reducer(s, reset())
    expect(s2.projectId).toBe('')
    expect(s2.rows).toEqual([{ name: '', quantity: 0, unit: '', price: 0, currency: 'NIS' }])
  })
})
