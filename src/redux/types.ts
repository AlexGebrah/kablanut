// Types for our Redux state
import type { UserType } from '../components/typesComponents/UserType'

export interface User {
    id?: string
    name?: string
    email: string
}
export interface AuthState {
    isAuthenticated: boolean
    user: User | null
    loading: boolean
    error: string | null
}
export interface AuthCreateUserState {
    data: UserType | null
    loading: boolean
    error: string | null
}
export interface RootState {
    auth: AuthState
    authCreateUser: AuthCreateUserState
}