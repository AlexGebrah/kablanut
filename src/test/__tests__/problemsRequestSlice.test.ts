import reducer, { setForm, updateByPath, resetForm } from '../../redux/slices/problemsRequestSlice.ts'
import { describe, it, expect } from 'vitest'
import type { AlarmType } from '../../components/typesComponents/AlarmType.ts'

const getInitial = () => reducer(undefined as unknown as ReturnType<typeof reducer>, { type: '@@INIT' } as any)

const makeForm = (overrides: Partial<AlarmType> = {}): AlarmType => ({
  id: 'ALM-TEST',
  project: { id: 'p-1', projectName: 'Proj' },
  user: { id: 'u-1', fullName: { firstName: 'John', lastName: 'Doe' } },
  dateCreate: '2025-10-01',
  status: 'draft',
  title: 'other',
  description: 'Something happened',
  ...overrides,
})

describe('problemsRequestSlice', () => {
  it('should return initial state on first run', () => {
    const state: any = getInitial()
    expect(state.form).toBeTruthy()
    expect(state.form.id).toBe('ALM-0001')
    expect(state.form.project.projectName).toBe('Oron')
    expect(state.form.status).toBe('draft')
    expect(state.form.title).toBe('other')
  })

  it('setForm should replace the entire form', () => {
    const initial: any = getInitial()
    const newForm = makeForm({ title: 'no material' })
    const next: any = reducer(initial, setForm(newForm))
    expect(next.form).toEqual(newForm)
  })

  it('updateByPath should update a nested field (user.fullName.firstName)', () => {
    const prev: any = getInitial()
    const prevFirst = prev.form.user.fullName.firstName
    const next: any = reducer(prev, updateByPath({ path: 'user.fullName.firstName', value: 'Alice' }))
    expect(next.form.user.fullName.firstName).toBe('Alice')
    // previous state unchanged
    expect(prev.form.user.fullName.firstName).toBe(prevFirst)
  })

  it('updateByPath should update a top-level field (title)', () => {
    const prev: any = getInitial()
    const next: any = reducer(prev, updateByPath({ path: 'title', value: 'no ready' }))
    expect(next.form.title).toBe('no ready')
    expect(prev.form.title).not.toBe('no ready')
  })

  it('resetForm should restore the initial form', () => {
    const initial: any = getInitial()
    const modified: any = reducer(initial, setForm(makeForm({ title: 'umit' })))
    expect(modified.form.title).toBe('umit')
    const reset: any = reducer(modified, resetForm())
    expect(reset.form.title).toBe('other')
    expect(reset.form.project.projectName).toBe('Oron')
  })
})
