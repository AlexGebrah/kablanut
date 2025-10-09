import reducer, { createUser, clearCreateUserError, resetCreateUser } from '../createUserSlice.ts'
import type { AuthCreateUserState } from '../../types'
import type { UserType } from '../../../components/typesComponents/UserType'
import { describe, it, expect } from 'vitest'

const getInitial = (): AuthCreateUserState => ({
  data: null,
  loading: false,
  error: null,
})

describe('authCreateUser slice', () => {
  it('should return initial state on first run', () => {
    const state = reducer(undefined as unknown as AuthCreateUserState, { type: '@@INIT' })
    expect(state).toEqual(getInitial())
  })

  it('clearCreateUserError should nullify error', () => {
    const prev: AuthCreateUserState = { ...getInitial(), error: 'boom' }
    const next = reducer(prev, clearCreateUserError())
    expect(next.error).toBeNull()
  })

  it('resetCreateUser should reset to initial', () => {
    const prev: AuthCreateUserState = {
      data: { id: '1', fullName: { firstName: 'A', lastName: 'B' }, birthDate: '2000-01-01', address: { city: 'c', street: 's', house: '1', room: '2', zip: '3' }, contacts: { telephone: 't', mail: 'm' }, company: 'X', role: 'R' } as UserType,
      loading: true,
      error: 'err',
    }
    const next = reducer(prev, resetCreateUser())
    expect(next).toEqual(getInitial())
  })

  describe('createUser async cases', () => {
    it('pending sets loading true and clears error', () => {
      const prev = getInitial()
      const next = reducer(prev, { type: createUser.pending.type })
      expect(next.loading).toBe(true)
      expect(next.error).toBeNull()
    })

    it('fulfilled sets data and loading false', () => {
      const prev = { ...getInitial(), loading: true }
      const payload: UserType = {
        id: '100',
        fullName: { firstName: 'John', lastName: 'Doe' },
        birthDate: '1990-01-01',
        address: { city: 'City', street: 'Main', house: '1', room: '1', zip: '00000' },
        contacts: { telephone: '+111', mail: 'john@example.com' },
        company: 'Acme',
        role: 'dev',
      }
      const next = reducer(prev, { type: createUser.fulfilled.type, payload })
      expect(next.loading).toBe(false)
      expect(next.data).toEqual(payload)
    })

    it('rejected sets error and loading false', () => {
      const prev = { ...getInitial(), loading: true }
      const errorMsg = 'Ошибка создания пользователя'
      const next = reducer(prev, { type: createUser.rejected.type, payload: errorMsg })
      expect(next.loading).toBe(false)
      expect(next.error).toBe(errorMsg)
    })
  })
})
