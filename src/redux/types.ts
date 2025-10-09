// Types for our Redux state
import type { UserType } from '../components/typesComponents/UserType'
import type { ProjectType } from '../components/typesComponents/ProjectType'

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
export interface CreateProjectState {
    form: ProjectType
}
export interface RootState {
    auth: AuthState
    authCreateUser: AuthCreateUserState
    createProject: CreateProjectState
}