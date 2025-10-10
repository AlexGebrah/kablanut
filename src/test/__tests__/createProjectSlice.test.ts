import reducer, { setForm, updateByPath, resetForm } from '../../redux/slices/createProjectSlice.ts'
import type { CreateProjectState } from '../../redux/types.ts'
import type { ProjectType } from '../../components/typesComponents/ProjectType.ts'
import { describe, it, expect } from 'vitest'

const getInitial = (): CreateProjectState => reducer(undefined as unknown as CreateProjectState, { type: '@@INIT' })

const makeForm = (overrides: Partial<ProjectType> = {}): ProjectType => ({
  id: 'p1',
  projectName: 'TestProject',
  projectKind: 'KIND',
  projectDateStart: '2025-01-01',
  projectDateFinish: '2025-12-31',
  customer: 'Customer',
  manufacturer: 'Factory',
  kablan: ['Kablan1'],
  designer: 'Designer',
  executor: ['Exec1'],
  admin: 'Admin',
  projectStatus: 'draft',
  projectAddress: { city: 'City', street: 'Street', house: '1', zip: '00000', room: '' },
  specificationPlan: [ { name: 'Plan', quantity: 1, unit: 'm2', price: 10, currency: 'NIS' } ],
  specificationFact: [ { name: 'Fact', quantity: 0, unit: 'm2', price: 0, currency: 'NIS' } ],
  ...overrides,
})

describe('createProjectSlice', () => {
  it('should return initial state on first run', () => {
    const state = getInitial()
    expect(state.form).toBeTruthy()
    expect(state.form.projectName).toBe('Oron')
    expect(state.form.kablan).toContain('Rabinovich')
  })

  it('setForm should replace the entire form', () => {
    const initial = getInitial()
    const newForm = makeForm({ projectName: 'NewName' })
    const next = reducer(initial, setForm(newForm))
    expect(next.form).toEqual(newForm)
  })

  it('updateByPath should update a nested field (projectAddress.city)', () => {
    const prev = getInitial()
    const prevCity = prev.form.projectAddress.city
    const next = reducer(prev, updateByPath({ path: 'projectAddress.city', value: 'Tel Aviv' }))
    expect(next.form.projectAddress.city).toBe('Tel Aviv')
    // ensure previous state not mutated (Immer immutability)
    expect(prev.form.projectAddress.city).toBe(prevCity)
  })

  it('updateByPath should replace an array field (kablan)', () => {
    const prev = getInitial()
    const next = reducer(prev, updateByPath({ path: 'kablan', value: ['A', 'B'] }))
    expect(next.form.kablan).toEqual(['A', 'B'])
    // previous state unchanged
    expect(prev.form.kablan).not.toEqual(['A', 'B'])
  })

  it('resetForm should restore the initial form', () => {
    const initial = getInitial()
    const modified = reducer(initial, setForm(makeForm({ projectName: 'Temp' })))
    expect(modified.form.projectName).toBe('Temp')
    const reset = reducer(modified, resetForm())
    expect(reset.form.projectName).toBe('Oron')
  })
})
