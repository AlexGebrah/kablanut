// typescript
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type { ProjectType } from '../../components/typesComponents/ProjectType'
import { PROJECT_KIND_HPL } from '../../constants/TypeConstants'
import { BASE_URL } from '../../constants/UrlConstants'
import { secureFetch } from './authSlice'
import type { CreateProjectState } from '../types'

export const createProject = createAsyncThunk(
    'createProject/create',
    async (payload: ProjectType, { rejectWithValue }) => {
        try {
            const res = await fetch(`${BASE_URL}/project`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                const msg = (data && (data.message || data.error)) || 'Ошибка создания проекта'
                return rejectWithValue(msg)
            }

            const data = await res.json()
            return data as ProjectType
        } catch (e) {
            return rejectWithValue((e as Error).message || 'Ошибка сети')
        }
    },
)

export const searchProjectById = createAsyncThunk(
    'createProject/searchProjectById',
    async (projectId: string, { rejectWithValue }) => {
        try {
            const res = await secureFetch(`${BASE_URL}/project/${projectId}`)

            if (!res.ok) {
                if (res.status === 404) {
                    return rejectWithValue('Проект не найден')
                }
                const data = await res.json().catch(() => ({}))
                const msg = data?.message || data?.error || 'Ошибка поиска проекта'
                return rejectWithValue(msg)
            }

            const data = await res.json()
            return data as ProjectType
        } catch (e) {
            return rejectWithValue((e as Error).message || 'Ошибка сети')
        }
    },
)

export const updateProject = createAsyncThunk(
    'createProject/updateProject',
    async (payload: ProjectType, { rejectWithValue }) => {
        try {
            const res = await secureFetch(`${BASE_URL}/project/${payload.id}`, {
                method: 'PUT',
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                const msg = data?.message || data?.error || 'Ошибка обновления проекта'
                return rejectWithValue(msg)
            }

            const data = await res.json()
            return data as ProjectType
        } catch (e) {
            return rejectWithValue((e as Error).message || 'Ошибка сети')
        }
    },
)

export const deleteProject = createAsyncThunk(
    'createProject/deleteProject',
    async (projectId: string, { rejectWithValue }) => {
        try {
            const res = await secureFetch(`${BASE_URL}/project/${projectId}`, {
                method: 'DELETE',
            })

            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                const msg = data?.message || data?.error || 'Ошибка удаления проекта'
                return rejectWithValue(msg)
            }

            return projectId
        } catch (e) {
            return rejectWithValue((e as Error).message || 'Ошибка сети')
        }
    },
)

const initialState: CreateProjectState = {
    form: {
        id: '20250912oron',
        projectName: 'Oron',
        projectKind: PROJECT_KIND_HPL,
        projectDateStart: '2025-08-12',
        projectDateFinish: '2026-02-21',
        customer: 'Rav Barieh',
        manufacturer: 'Alucal',
        kablan: ['Rabinovich'],
        designer: 'MTM',
        executor: ['Oleg'],
        admin: 'Michael',
        projectStatus: 'draft',
        projectAddress: {
            city: '',
            street: '',
            house: '',
            zip: '',
            room: '',
        },
        specificationPlan: [
            {
                name: 'Площадь по плану',
                quantity: 400,
                unit: 'м2',
                price: 50,
                currency: 'NIS',
            },
        ],
        specificationFact: [
            {
                name: 'Площадь факт',
                quantity: 100,
                unit: 'м2',
                price: 50,
                currency: 'NIS',
            },
        ],
    },
    loading: false,
    error: null,
    searchedProject: null,
    searchLoading: false,
    searchError: null,
}

export type UpdateByPathPayload = { path: string; value: unknown }

const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj))

const createProjectSlice = createSlice({
    name: 'createProject',
    initialState,
    reducers: {
        setForm(state, action: PayloadAction<ProjectType>) {
            state.form = deepClone(action.payload)
        },
        updateByPath(state, action: PayloadAction<UpdateByPathPayload>) {
            const { path, value } = action.payload
            const parts = path.split('.')
            let cursor: Record<string, unknown> = state.form as unknown as Record<string, unknown>

            for (let i = 0; i < parts.length - 1; i++) {
                const key = parts[i]
                const current = cursor[key]

                if (Array.isArray(current)) {
                    cursor[key] = [...(current as unknown[])]
                } else if (typeof current === 'object' && current !== null) {
                    cursor[key] = { ...(current as Record<string, unknown>) }
                } else {
                    cursor[key] = {}
                }

                cursor = cursor[key] as Record<string, unknown>
            }

            cursor[parts[parts.length - 1]] = value
        },
        resetForm(state) {
            state.form = deepClone(initialState.form)
            state.error = null
        },
        clearSearchedProject: (state) => {
            state.searchedProject = null
            state.searchError = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createProject.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.loading = false
                state.form = action.payload
            })
            .addCase(createProject.rejected, (state, action) => {
                state.loading = false
                state.error = (action.payload as string) || action.error.message || 'Ошибка создания'
            })

        builder
            .addCase(searchProjectById.pending, (state) => {
                state.searchLoading = true
                state.searchError = null
            })
            .addCase(searchProjectById.fulfilled, (state, action) => {
                state.searchLoading = false
                state.searchedProject = action.payload
            })
            .addCase(searchProjectById.rejected, (state, action) => {
                state.searchLoading = false
                state.searchError = (action.payload as string) || action.error.message || 'Ошибка поиска'
            })

        builder
            .addCase(updateProject.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateProject.fulfilled, (state, action) => {
                state.loading = false
                state.form = action.payload
                state.searchedProject = action.payload
            })
            .addCase(updateProject.rejected, (state, action) => {
                state.loading = false
                state.error = (action.payload as string) || action.error.message || 'Ошибка обновления'
            })

        builder
            .addCase(deleteProject.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(deleteProject.fulfilled, (state) => {
                state.loading = false
                state.form = deepClone(initialState.form)
                state.searchedProject = null
            })
            .addCase(deleteProject.rejected, (state, action) => {
                state.loading = false
                state.error = (action.payload as string) || action.error.message || 'Ошибка удаления'
            })
    },
})

export const { setForm, updateByPath, resetForm, clearSearchedProject } = createProjectSlice.actions
export default createProjectSlice.reducer
