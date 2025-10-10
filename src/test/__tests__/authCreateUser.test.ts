import reducer, {
  createUser,
  searchUserById,
  updateUser,
  deleteUser,
  clearCreateUserError,
  resetCreateUser,
  clearSearchedUser,
} from '../../redux/slices/createUserSlice.ts'
import type { AuthCreateUserState } from '../../redux/slices/createUserSlice.ts'
import type { UserType } from '../../components/typesComponents/UserType.ts'
import { describe, it, expect } from 'vitest'

const getInitial = (): AuthCreateUserState => ({
  data: null,
  loading: false,
  error: null,
  searchedUser: null,
  searchLoading: false,
  searchError: null,
})

describe('authCreateUser slice', () => {
  it('should return initial state on first run', () => {
    const state = reducer(undefined as unknown as AuthCreateUserState, { type: '@@INIT' })
    expect(state).toEqual(getInitial())
  })

  it('clearCreateUserError should nullify both errors', () => {
    const prev: AuthCreateUserState = { ...getInitial(), error: 'boom', searchError: 'e2' }
    const next = reducer(prev, clearCreateUserError())
    expect(next.error).toBeNull()
    expect(next.searchError).toBeNull()
  })

  it('resetCreateUser should reset some fields', () => {
    const prev: AuthCreateUserState = {
      data: { id: '1', fullName: { firstName: 'A', lastName: 'B' }, birthDate: '2000-01-01', address: { city: 'c', street: 's', house: '1', room: '2', zip: '3' }, contacts: { telephone: 't', mail: 'm' }, company: 'X', role: 'R' } as UserType,
      loading: true,
      error: 'err',
      searchedUser: { id: '2', fullName: { firstName: 'C', lastName: 'D' }, birthDate: '', address: { city: '', street: '', house: '', room: '', zip: '' }, contacts: { telephone: '', mail: '' }, company: '', role: '' },
      searchLoading: true,
      searchError: 'se',
    }
    const next = reducer(prev, resetCreateUser())
    expect(next.data).toBeNull()
    expect(next.loading).toBe(false)
    expect(next.error).toBeNull()
    // search-related fields unchanged by resetCreateUser
    expect(next.searchedUser).toEqual(prev.searchedUser)
    expect(next.searchLoading).toBe(prev.searchLoading)
    expect(next.searchError).toBe(prev.searchError)
  })

  it('clearSearchedUser should nullify searchedUser and searchError', () => {
    const prev: AuthCreateUserState = { ...getInitial(), searchedUser: { id: 'x', fullName: { firstName: 'X', lastName: 'Y' }, birthDate: '', address: { city: '', street: '', house: '', room: '', zip: '' }, contacts: { telephone: '', mail: '' }, company: '', role: '' }, searchError: 'oops' }
    const next = reducer(prev, clearSearchedUser())
    expect(next.searchedUser).toBeNull()
    expect(next.searchError).toBeNull()
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
      const errorMsg = 'Ошибка создания'
      const next = reducer(prev, { type: createUser.rejected.type, payload: errorMsg })
      expect(next.loading).toBe(false)
      expect(next.error).toBe(errorMsg)
    })
  })

  describe('searchUserById async cases', () => {
    it('pending sets searchLoading true and clears searchError', () => {
      const prev = getInitial()
      const next = reducer(prev, { type: searchUserById.pending.type })
      expect(next.searchLoading).toBe(true)
      expect(next.searchError).toBeNull()
    })

    it('fulfilled sets searchedUser and searchLoading false', () => {
      const prev = { ...getInitial(), searchLoading: true }
      const payload: UserType = { id: '1', fullName: { firstName: 'A', lastName: 'B' }, birthDate: '', address: { city: '', street: '', house: '', room: '', zip: '' }, contacts: { telephone: '', mail: '' }, company: '', role: '' }
      const next = reducer(prev, { type: searchUserById.fulfilled.type, payload })
      expect(next.searchLoading).toBe(false)
      expect(next.searchedUser).toEqual(payload)
    })

    it('rejected sets searchError and searchLoading false', () => {
      const prev = { ...getInitial(), searchLoading: true }
      const msg = 'Ошибка поиска'
      const next = reducer(prev, { type: searchUserById.rejected.type, payload: msg })
      expect(next.searchLoading).toBe(false)
      expect(next.searchError).toBe(msg)
    })
  })

  describe('updateUser async cases', () => {
    it('pending sets loading true', () => {
      const prev = getInitial()
      const next = reducer(prev, { type: updateUser.pending.type })
      expect(next.loading).toBe(true)
    })
    it('fulfilled stores user in data and searchedUser', () => {
      const prev = { ...getInitial(), loading: true }
      const payload: UserType = { id: '2', fullName: { firstName: 'C', lastName: 'D' }, birthDate: '', address: { city: '', street: '', house: '', room: '', zip: '' }, contacts: { telephone: '', mail: '' }, company: '', role: '' }
      const next = reducer(prev, { type: updateUser.fulfilled.type, payload })
      expect(next.loading).toBe(false)
      expect(next.data).toEqual(payload)
      expect(next.searchedUser).toEqual(payload)
    })
    it('rejected sets error', () => {
      const prev = { ...getInitial(), loading: true }
      const next = reducer(prev, { type: updateUser.rejected.type, payload: 'Ошибка обновления' })
      expect(next.loading).toBe(false)
      expect(next.error).toBe('Ошибка обновления')
    })
  })

  describe('deleteUser async cases', () => {
    it('pending sets loading true', () => {
      const prev = getInitial()
      const next = reducer(prev, { type: deleteUser.pending.type })
      expect(next.loading).toBe(true)
    })
    it('fulfilled clears data and searchedUser', () => {
      const prev: AuthCreateUserState = { ...getInitial(), loading: true, data: { id: '1', fullName: { firstName: 'A', lastName: 'B' }, birthDate: '', address: { city: '', street: '', house: '', room: '', zip: '' }, contacts: { telephone: '', mail: '' }, company: '', role: '' }, searchedUser: { id: '1', fullName: { firstName: 'A', lastName: 'B' }, birthDate: '', address: { city: '', street: '', house: '', room: '', zip: '' }, contacts: { telephone: '', mail: '' }, company: '', role: '' } }
      const next = reducer(prev, { type: deleteUser.fulfilled.type })
      expect(next.loading).toBe(false)
      expect(next.data).toBeNull()
      expect(next.searchedUser).toBeNull()
    })
    it('rejected sets error', () => {
      const prev = { ...getInitial(), loading: true }
      const next = reducer(prev, { type: deleteUser.rejected.type, payload: 'Ошибка удаления' })
      expect(next.loading).toBe(false)
      expect(next.error).toBe('Ошибка удаления')
    })
  })
})
