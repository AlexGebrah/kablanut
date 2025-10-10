import reducer, { logout, clearError, loginUser, loginWithGoogle, loginWithApple, registerUser } from '../../redux/slices/authSlice.ts'
import type { AuthState, User } from '../../redux/types.ts'
import { describe, it, expect } from 'vitest'

const getInitial = (): AuthState => ({
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
})

describe('authSlice', () => {
  it('should return the initial state on first run', () => {
    const state = reducer(undefined as unknown as AuthState, { type: '@@INIT' })
    expect(state).toEqual(getInitial())
  })

  it('clearError should set error to null', () => {
    const prev: AuthState = { ...getInitial(), error: 'Some error' }
    const next = reducer(prev, clearError())
    expect(next.error).toBeNull()
  })

  it('logout should reset auth and user', () => {
    const prev: AuthState = {
      isAuthenticated: true,
      user: { email: 'a@b.com', name: 'A' } as User,
      loading: false,
      error: null,
    }
    const next = reducer(prev, logout())
    expect(next.isAuthenticated).toBe(false)
    expect(next.user).toBeNull()
  })

  describe('loginUser async cases', () => {
    it('sets loading true on pending', () => {
      const prev = getInitial()
      const next = reducer(prev, { type: loginUser.pending.type })
      expect(next.loading).toBe(true)
      expect(next.error).toBeNull()
    })

    it('sets user and authenticated on fulfilled', () => {
      const prev = { ...getInitial(), loading: true }
      const payload: User = { email: 'test@example.com', name: 'Tester', id: '1' }
      const next = reducer(prev, { type: loginUser.fulfilled.type, payload })
      expect(next.loading).toBe(false)
      expect(next.isAuthenticated).toBe(true)
      expect(next.user).toEqual(payload)
    })

    it('sets error on rejected', () => {
      const prev = { ...getInitial(), loading: true }
      const errorMsg = 'Ошибка входа'
      const next = reducer(prev, { type: loginUser.rejected.type, payload: errorMsg })
      expect(next.loading).toBe(false)
      expect(next.error).toBe(errorMsg)
    })
  })

  describe('loginWithGoogle async cases', () => {
    it('pending', () => {
      const next = reducer(getInitial(), { type: loginWithGoogle.pending.type })
      expect(next.loading).toBe(true)
      expect(next.error).toBeNull()
    })
    it('fulfilled', () => {
      const payload: User = { email: 'user@gmail.com', name: 'Google User' }
      const prev = { ...getInitial(), loading: true }
      const next = reducer(prev, { type: loginWithGoogle.fulfilled.type, payload })
      expect(next.loading).toBe(false)
      expect(next.isAuthenticated).toBe(true)
      expect(next.user).toEqual(payload)
    })
    it('rejected', () => {
      const prev = { ...getInitial(), loading: true }
      const next = reducer(prev, { type: loginWithGoogle.rejected.type, payload: 'err' })
      expect(next.loading).toBe(false)
      expect(next.error).toBe('err')
    })
  })

  describe('loginWithApple async cases', () => {
    it('pending', () => {
      const next = reducer(getInitial(), { type: loginWithApple.pending.type })
      expect(next.loading).toBe(true)
      expect(next.error).toBeNull()
    })
    it('fulfilled', () => {
      const payload: User = { email: 'user@icloud.com', name: 'Apple User' }
      const prev = { ...getInitial(), loading: true }
      const next = reducer(prev, { type: loginWithApple.fulfilled.type, payload })
      expect(next.loading).toBe(false)
      expect(next.isAuthenticated).toBe(true)
      expect(next.user).toEqual(payload)
    })
    it('rejected', () => {
      const prev = { ...getInitial(), loading: true }
      const next = reducer(prev, { type: loginWithApple.rejected.type, payload: 'err2' })
      expect(next.loading).toBe(false)
      expect(next.error).toBe('err2')
    })
  })

  describe('registerUser async cases', () => {
    it('pending', () => {
      const next = reducer(getInitial(), { type: registerUser.pending.type })
      expect(next.loading).toBe(true)
      expect(next.error).toBeNull()
    })
    it('fulfilled', () => {
      const payload: User = { email: 'new@example.com', name: 'New' }
      const prev = { ...getInitial(), loading: true }
      const next = reducer(prev, { type: registerUser.fulfilled.type, payload })
      expect(next.loading).toBe(false)
      expect(next.isAuthenticated).toBe(true)
      expect(next.user).toEqual(payload)
    })
    it('rejected', () => {
      const prev = { ...getInitial(), loading: true }
      const next = reducer(prev, { type: registerUser.rejected.type, payload: 'err3' })
      expect(next.loading).toBe(false)
      expect(next.error).toBe('err3')
    })
  })
})
