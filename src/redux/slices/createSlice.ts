import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'

// Типы для форм создания
export type CreateUserForm = {
  name: string
  email: string
  phone: string
  role: string
  password: string
  confirmPassword: string
}

export type AddressForm = {
  city: string
  street: string
  house: string
  zip: string
  room: string
}

export type CreateProjectForm = {
  projectName: string
  projectKind: string
  projectDateStart: string
  projectDateFinish: string
  projectAddress: AddressForm
  customer: string
  manufacturer: string
  kablan: string
  designer: string
  executor: string
  admin: string
}

// Начальные значения форм
const initialUserForm: CreateUserForm = {
  name: '',
  email: '',
  phone: '',
  role: '',
  password: '',
  confirmPassword: '',
}

const initialProjectForm: CreateProjectForm = {
  projectName: '',
  projectKind: '',
  projectDateStart: '',
  projectDateFinish: '',
  projectAddress: {
    city: '',
    street: '',
    house: '',
    zip: '',
    room: '',
  },
  customer: '',
  manufacturer: '',
  kablan: '',
  designer: '',
  executor: '',
  admin: '',
}

// Состояние слайса
type CreateState = {
  createUserForm: CreateUserForm
  createProjectForm: CreateProjectForm

  savingUser: boolean
  savingProject: boolean

  errorUser?: string
  errorProject?: string

  lastCreatedUserId?: string
  lastCreatedProjectId?: string
}

const initialState: CreateState = {
  createUserForm: initialUserForm,
  createProjectForm: initialProjectForm,
  savingUser: false,
  savingProject: false,
  errorUser: undefined,
  errorProject: undefined,
  lastCreatedUserId: undefined,
  lastCreatedProjectId: undefined,
}

// Эмуляция сохранения пользователя
export const saveCreateUser = createAsyncThunk<
  { id: string },
  void,
  { state: { create: CreateState } }
>('create/saveCreateUser', async (_arg, { getState, signal, rejectWithValue }) => {
  try {
    const { createUserForm } = getState().create
    // Простая валидация формы
    if (!createUserForm.name.trim()) throw new Error('Введите имя пользователя')
    if (!createUserForm.email.trim()) throw new Error('Введите email')
    if (createUserForm.password.length < 6) throw new Error('Минимальная длина пароля — 6 символов')
    if (createUserForm.password !== createUserForm.confirmPassword) {
      throw new Error('Пароль и подтверждение пароля не совпадают')
    }

    // Эмуляция запроса
    const id = `user_${Date.now()}`
    await new Promise<void>((resolve, reject) => {
      const t = setTimeout(resolve, 500)
      signal.addEventListener('abort', () => {
        clearTimeout(t)
        reject(new DOMException('Aborted', 'AbortError'))
      })
    })
    // Вернули "созданный" id
    return { id }
  } catch (e: any) {
    const msg = e?.message || 'Ошибка сохранения пользователя'
    return rejectWithValue(msg)
  }
})

// Эмуляция сохранения проекта
export const saveCreateProject = createAsyncThunk<
  { id: string },
  void,
  { state: { create: CreateState } }
>('create/saveCreateProject', async (_arg, { getState, signal, rejectWithValue }) => {
  try {
    const { createProjectForm } = getState().create
    // Простая валидация формы
    if (!createProjectForm.projectName.trim()) throw new Error('Введите название проекта')
    if (!createProjectForm.projectKind.trim()) throw new Error('Выберите тип проекта')
    if (!createProjectForm.projectDateStart) throw new Error('Укажите дату начала')
    if (!createProjectForm.projectDateFinish) throw new Error('Укажите дату завершения')

    // Эмуляция запроса
    const id = `project_${Date.now()}`
    await new Promise<void>((resolve, reject) => {
      const t = setTimeout(resolve, 700)
      signal.addEventListener('abort', () => {
        clearTimeout(t)
        reject(new DOMException('Aborted', 'AbortError'))
      })
    })
    return { id }
  } catch (e: any) {
    const msg = e?.message || 'Ошибка сохранения проекта'
    return rejectWithValue(msg)
  }
})

const createSliceDef = createSlice({
  name: 'create',
  initialState,
  reducers: {
    // Работа с формой пользователя
    setCreateUserField: <K extends keyof CreateUserForm>(
      state: { createUserForm: { [x: string]: CreateUserForm[K] } },
      action: PayloadAction<{ field: K; value: CreateUserForm[K] }>
    ) => {
      const { field, value } = action.payload
      state.createUserForm[field] = value
    },
    resetCreateUserForm: (state) => {
      state.createUserForm = { ...initialUserForm }
      state.errorUser = undefined
      state.lastCreatedUserId = undefined
    },

    // Работа с формой проекта
    setCreateProjectField: <K extends keyof CreateProjectForm>(
      state: { createProjectForm: { [x: string]: string | AddressForm } },
      action: PayloadAction<{ field: K; value: CreateProjectForm[K] }>
    ) => {
      const { field, value } = action.payload
      state.createProjectForm[field] = value
    },

    // Отдельные сеттеры для вложенного адреса
    setCreateProjectAddressField: <K extends keyof AddressForm>(
      state: { createProjectForm: { projectAddress: { [x: string]: AddressForm[K] } } },
      action: PayloadAction<{ field: K; value: AddressForm[K] }>
    ) => {
      const { field, value } = action.payload
      state.createProjectForm.projectAddress[field] = value
    },

    resetCreateProjectForm: (state) => {
      state.createProjectForm = { ...initialProjectForm }
      state.errorProject = undefined
      state.lastCreatedProjectId = undefined
    },

    // Очистка ошибок вручную
    clearCreateErrors: (state) => {
      state.errorUser = undefined
      state.errorProject = undefined
    },
  },
  extraReducers: (builder) => {
    // USER
    builder
      .addCase(saveCreateUser.pending, (state) => {
        state.savingUser = true
        state.errorUser = undefined
      })
      .addCase(saveCreateUser.fulfilled, (state, action) => {
        state.savingUser = false
        state.lastCreatedUserId = action.payload.id
        // Можно сбросить форму после успешного сохранения
        state.createUserForm = { ...initialUserForm }
      })
      .addCase(saveCreateUser.rejected, (state, action) => {
        state.savingUser = false
        state.errorUser = (action.payload as string) || action.error.message || 'Ошибка сохранения пользователя'
      })

    // PROJECT
    builder
      .addCase(saveCreateProject.pending, (state) => {
        state.savingProject = true
        state.errorProject = undefined
      })
      .addCase(saveCreateProject.fulfilled, (state, action) => {
        state.savingProject = false
        state.lastCreatedProjectId = action.payload.id
        // Можно сбросить форму после успешного сохранения
        state.createProjectForm = { ...initialProjectForm }
      })
      .addCase(saveCreateProject.rejected, (state, action) => {
        state.savingProject = false
        state.errorProject =
          (action.payload as string) || action.error.message || 'Ошибка сохранения проекта'
      })
  },
})

export const {
  setCreateUserField,
  resetCreateUserForm,
  setCreateProjectField,
  setCreateProjectAddressField,
  resetCreateProjectForm,
  clearCreateErrors,
} = createSliceDef.actions

export default createSliceDef.reducer

// Селекторы
export const selectCreateUserForm = (state: { create: CreateState }) => state.create.createUserForm
export const selectCreateProjectForm = (state: { create: CreateState }) => state.create.createProjectForm

export const selectCreateSavingUser = (state: { create: CreateState }) => state.create.savingUser
export const selectCreateSavingProject = (state: { create: CreateState }) => state.create.savingProject

export const selectCreateErrorUser = (state: { create: CreateState }) => state.create.errorUser
export const selectCreateErrorProject = (state: { create: CreateState }) => state.create.errorProject

export const selectLastCreatedUserId = (state: { create: CreateState }) => state.create.lastCreatedUserId
export const selectLastCreatedProjectId = (state: { create: CreateState }) => state.create.lastCreatedProjectId