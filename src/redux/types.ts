// Types for our Redux state
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
export interface RootState {
    auth: AuthState
}