import reducer, { setForm, updateByPath, addItem, removeItem, updateItem, resetForm, createMaterialsRequest } from '../../redux/slices/materialsRequestSlice.ts'
import type { MaterialsRequestState } from '../../redux/slices/materialsRequestSlice.ts'
import type { MaterialsType, MaterialItem } from '../../components/typesComponents/MaterialsType.ts'
import { describe, it, expect } from 'vitest'

const getInitial = (): MaterialsRequestState => reducer(undefined as unknown as MaterialsRequestState, { type: '@@INIT' })

const makeForm = (overrides: Partial<MaterialsType> = {}): MaterialsType => ({
  id: 'MRQ-1234',
  project: { id: 'p-1' },
  user: { id: 'u-1', fullName: { firstName: 'John', lastName: 'Doe' } as any } as any,
  items: [ { materialName: 'Wood', quantity: 5, unit: 'pcs' } ],
  dateCreate: '2025-01-01',
  status: 'draft',
  ...overrides,
})

describe('materialsRequestSlice', () => {
  it('returns initial state on first run', () => {
    const state = getInitial()
    expect(state.form.id).toBe('MRQ-0001')
    expect(state.form.items.length).toBeGreaterThan(0)
    expect(state.form.status).toBe('draft')
  })

  it('setForm replaces entire form', () => {
    const initial = getInitial()
    const form = makeForm({ id: 'MRQ-9999', status: 'active' })
    const next = reducer(initial, setForm(form))
    expect(next.form).toEqual(form)
  })

  it('updateByPath updates nested path (user.fullName.firstName)', () => {
    const prev = getInitial()
    const prevName = prev.form.user.fullName.firstName as any
    const next = reducer(prev, updateByPath({ path: 'user.fullName.firstName', value: 'Alice' }))
    expect(next.form.user.fullName.firstName).toBe('Alice')
    // ensure immutability
    expect(prev.form.user.fullName.firstName).toBe(prevName)
  })

  it('addItem appends a new empty item', () => {
    const prev = getInitial()
    const count = prev.form.items.length
    const next = reducer(prev, addItem())
    expect(next.form.items.length).toBe(count + 1)
    const added = next.form.items[next.form.items.length - 1]
    expect(added).toEqual({ materialName: '', quantity: 0, unit: '' })
  })

  it('removeItem removes by index', () => {
    const prev = reducer(getInitial(), setForm(makeForm({ items: [
      { materialName: 'A', quantity: 1, unit: 'u' },
      { materialName: 'B', quantity: 2, unit: 'u' },
      { materialName: 'C', quantity: 3, unit: 'u' },
    ] })))
    const next = reducer(prev, removeItem(1))
    expect(next.form.items.map(i => i.materialName)).toEqual(['A', 'C'])
  })

  it('updateItem updates a particular field in an item', () => {
    const prev = reducer(getInitial(), setForm(makeForm({ items: [
      { materialName: 'A', quantity: 1, unit: 'u' },
    ] })))
    const next = reducer(prev, updateItem({ index: 0, key: 'quantity', value: 10 as MaterialItem['quantity'] }))
    expect(next.form.items[0].quantity).toBe(10)
    // immutability for array element
    expect(prev.form.items[0].quantity).toBe(1)
  })

  it('resetForm restores initial form', () => {
    const modified = reducer(getInitial(), setForm(makeForm({ id: 'MRQ-xxxx' })))
    const reset = reducer(modified, resetForm())
    expect(reset.form.id).toBe('MRQ-0001')
  })

  it('updateByPath can replace the items array', () => {
    const prev = getInitial()
    const replacement: MaterialItem[] = [ { materialName: 'X', quantity: 99, unit: 'pcs' } ]
    const next = reducer(prev, updateByPath({ path: 'items', value: replacement }))
    expect(next.form.items).toEqual(replacement)
    expect(prev.form.items).not.toEqual(replacement)
  })

  it('handles createMaterialsRequest.pending by setting loading and clearing error', () => {
    const prev = getInitial()
    const next = reducer(prev, { type: createMaterialsRequest.pending.type })
    expect(next.loading).toBe(true)
    expect(next.error).toBeNull()
  })

  it('handles createMaterialsRequest.fulfilled by stopping loading and syncing form', () => {
    const prev = getInitial()
    const payload = makeForm({ id: 'MRQ-SERVER' })
    const next = reducer(prev, { type: createMaterialsRequest.fulfilled.type, payload })
    expect(next.loading).toBe(false)
    expect(next.form.id).toBe('MRQ-SERVER')
  })

  it('handles createMaterialsRequest.rejected by stopping loading and setting error', () => {
    const prev = getInitial()
    const next = reducer(prev, { type: createMaterialsRequest.rejected.type, payload: 'Server error', error: { message: 'X' } })
    expect(next.loading).toBe(false)
    expect(next.error).toBe('Server error')
  })
})
