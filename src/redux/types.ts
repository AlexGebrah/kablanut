// Types for our Redux state
import type { ProjectType } from '../components/typesComponents/ProjectType'
import type { MaterialsType } from '../components/typesComponents/MaterialsType'
import type { AlarmType } from '../components/typesComponents/AlarmType'
import type { SpecificationType } from '../components/typesComponents/SpecificationType'

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
    data: null,
    loading: false,
    error: null,
    searchedUser: null,
    searchLoading: false,
    searchError: null,
}
export interface CreateProjectState {
    form: ProjectType
    loading: boolean
    error: string | null
    searchedProject: ProjectType | null
    searchLoading: boolean
    searchError: string | null
}
export interface MaterialsRequestState {
    form: MaterialsType
}
export interface ProblemsRequestState {
    form: AlarmType
}
export interface ProjectPlanCreateState {
    projectId: string
    rows: SpecificationType[]
}
export interface ProjectFactCreateState {
    projectId: string
    reportDate: string
    planItems: SpecificationType[]
    rows: SpecificationType[]
}
export interface RootState {
    auth: AuthState
    authCreateUser: AuthCreateUserState
    createProject: CreateProjectState
    materialsRequest: MaterialsRequestState
    problemsRequest: ProblemsRequestState
    projectPlanCreate: ProjectPlanCreateState
    projectFactCreate: ProjectFactCreateState
}