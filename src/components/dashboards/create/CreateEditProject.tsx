// typescript
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../../../redux/types'
import type { ProjectType } from '../../typesComponents/ProjectType'
import { searchProjectById, updateProject, deleteProject, clearSearchedProject } from '../../../redux/slices/createProjectSlice'
import type { AppDispatch } from '../../../redux/store'

export const CreateEditProject = () => {
    const navigate = useNavigate()
    const { user } = useSelector((state: RootState) => state.auth)
    const dispatch = useDispatch<AppDispatch>()
    const { loading, error, searchedProject, searchLoading, searchError } = useSelector(
        (state: RootState) => state.createProject
    )

    const [searchId, setSearchId] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const [form, setForm] = useState<ProjectType>({
        id: '',
        projectName: '',
        projectKind: '',
        projectDateStart: '',
        projectDateFinish: '',
        specificationPlan: [],
        specificationFact: [],
        projectAddress: {
            city: '',
            street: '',
            house: '',
            zip: '',
            room: '',
        },
        projectStatus: '',
        customer: '',
        manufacturer: '',
        kablan: [],
        designer: '',
        executor: [],
        admin: '',
    })

    const update = (path: string, value: string | number | string[]) => {
        setForm(prev => {
            // глубокое клонирование состояния для безопасной мутации
            const next = JSON.parse(JSON.stringify(prev)) as ProjectType
            const parts = path.split('.')
            // курсор без any
            let cursor: Record<string, unknown> = next as unknown as Record<string, unknown>

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

            cursor[parts[parts.length - 1]] = value as unknown
            return next
        })
    }

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!searchId.trim()) {
            return
        }

        try {
            const result = await dispatch(searchProjectById(searchId.trim())).unwrap()
            setForm(result)
            setIsEditing(false)
        } catch (err) {
            console.error('Search project failed', err)
        }
    }

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleCancelEdit = () => {
        if (searchedProject) {
            setForm(searchedProject)
        }
        setIsEditing(false)
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await dispatch(updateProject(form)).unwrap()
            setIsEditing(false)
            alert('Проект успешно обновлён')
        } catch (err) {
            console.error('Update project failed', err)
        }
    }

    const handleDelete = async () => {
        if (!searchedProject) return

        try {
            await dispatch(deleteProject(searchedProject.id)).unwrap()
            setShowDeleteConfirm(false)
            setSearchId('')
            setForm({
                id: '',
                projectName: '',
                projectKind: '',
                projectDateStart: '',
                projectDateFinish: '',
                specificationPlan: [],
                specificationFact: [],
                projectAddress: {
                    city: '',
                    street: '',
                    house: '',
                    zip: '',
                    room: '',
                },
                projectStatus: '',
                customer: '',
                manufacturer: '',
                kablan: [],
                designer: '',
                executor: [],
                admin: '',
            })
            alert('Проект успешно удалён')
        } catch (err) {
            console.error('Delete project failed', err)
        }
    }

    const handleClearSearch = () => {
        dispatch(clearSearchedProject())
        setSearchId('')
        setForm({
            id: '',
            projectName: '',
            projectKind: '',
            projectDateStart: '',
            projectDateFinish: '',
            specificationPlan: [],
            specificationFact: [],
            projectAddress: {
                city: '',
                street: '',
                house: '',
                zip: '',
                room: '',
            },
            projectStatus: '',
            customer: '',
            manufacturer: '',
            kablan: [],
            designer: '',
            executor: [],
            admin: '',
        })
        setIsEditing(false)
    }

    return (
        <div className="min-h-screen w-full bg-black text-white">
            <header className="bg-gray-900 border-b border-yellow-400 py-4 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <h1 className="text-xl sm:text-2xl font-bold text-yellow-400">
                        Редактировать / Удалить Проект
                    </h1>
                    <div className="flex items-center space-x-4">
                        <span className="hidden sm:inline text-white">
                            Привет, {user?.name || 'Пользователь'}
                        </span>
                        <button
                            onClick={() => navigate('/dashboard/create')}
                            className="bg-yellow-400 text-black px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-[1.3125rem] sm:text-2xl font-medium hover:bg-yellow-300"
                        >
                            Назад
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-gray-900 border-2 border-yellow-400 rounded-lg p-4 sm:p-6 md:p-8">
                    {/* Search Section */}
                    <div className="mb-8 pb-8 border-b border-yellow-400">
                        <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
                            <label className="block text-sm font-medium text-yellow-400 mb-2">
                                Поиск проекта по ID
                            </label>
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={searchId}
                                    onChange={(e) => setSearchId(e.target.value)}
                                    className="flex-1 bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    placeholder="Введите ID проекта"
                                    disabled={searchLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={searchLoading || !searchId.trim()}
                                    className="px-6 py-3 rounded-lg border-2 border-yellow-400 text-lg font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 bg-black text-yellow-400 hover:bg-yellow-400 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {searchLoading ? 'Поиск...' : 'Найти'}
                                </button>
                                {searchedProject && (
                                    <button
                                        type="button"
                                        onClick={handleClearSearch}
                                        className="px-6 py-3 rounded-lg border-2 border-red-500 text-lg font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 bg-black text-red-500 hover:bg-red-500 hover:text-black"
                                    >
                                        Очистить
                                    </button>
                                )}
                            </div>
                            {searchError && (
                                <div className="mt-3 text-red-400 text-center">
                                    {searchError}
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Project Form Section */}
                    {searchedProject && (
                        <form onSubmit={handleUpdate} className="w-full max-w-3xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-yellow-400 mb-2">ID</label>
                                    <input
                                        type="text"
                                        value={form.id}
                                        className="w-full bg-gray-800 text-gray-500 border-2 border-gray-600 rounded-lg px-4 py-3 cursor-not-allowed"
                                        disabled
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-yellow-400 mb-2">Название проекта</label>
                                    <input
                                        type="text"
                                        value={form.projectName}
                                        onChange={(e) => update('projectName', e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                                            isEditing
                                                ? 'bg-black text-white border-yellow-400'
                                                : 'bg-gray-800 text-gray-300 border-gray-600 cursor-not-allowed'
                                        }`}
                                        placeholder="Oron"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-yellow-400 mb-2">Тип проекта</label>
                                    <input
                                        type="text"
                                        value={form.projectKind}
                                        onChange={(e) => update('projectKind', e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                                            isEditing
                                                ? 'bg-black text-white border-yellow-400'
                                                : 'bg-gray-800 text-gray-300 border-gray-600 cursor-not-allowed'
                                        }`}
                                        placeholder="HPL"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-yellow-400 mb-2">Статус</label>
                                    <input
                                        type="text"
                                        value={form.projectStatus}
                                        onChange={(e) => update('projectStatus', e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                                            isEditing
                                                ? 'bg-black text-white border-yellow-400'
                                                : 'bg-gray-800 text-gray-300 border-gray-600 cursor-not-allowed'
                                        }`}
                                        placeholder="draft"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-yellow-400 mb-2">Дата начала</label>
                                    <input
                                        type="date"
                                        value={form.projectDateStart}
                                        onChange={(e) => update('projectDateStart', e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                                            isEditing
                                                ? 'bg-black text-white border-yellow-400'
                                                : 'bg-gray-800 text-gray-300 border-gray-600 cursor-not-allowed'
                                        }`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-yellow-400 mb-2">Дата окончания</label>
                                    <input
                                        type="date"
                                        value={form.projectDateFinish}
                                        onChange={(e) => update('projectDateFinish', e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                                            isEditing
                                                ? 'bg-black text-white border-yellow-400'
                                                : 'bg-gray-800 text-gray-300 border-gray-600 cursor-not-allowed'
                                        }`}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-yellow-400 mb-2">Город</label>
                                    <input
                                        type="text"
                                        value={form.projectAddress.city}
                                        onChange={(e) => update('projectAddress.city', e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                                            isEditing
                                                ? 'bg-black text-white border-yellow-400'
                                                : 'bg-gray-800 text-gray-300 border-gray-600 cursor-not-allowed'
                                        }`}
                                        placeholder="Tel Aviv"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-yellow-400 mb-2">Улица</label>
                                    <input
                                        type="text"
                                        value={form.projectAddress.street}
                                        onChange={(e) => update('projectAddress.street', e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                                            isEditing
                                                ? 'bg-black text-white border-yellow-400'
                                                : 'bg-gray-800 text-gray-300 border-gray-600 cursor-not-allowed'
                                        }`}
                                        placeholder="Dizengoff"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-yellow-400 mb-2">Дом</label>
                                    <input
                                        type="text"
                                        value={form.projectAddress.house}
                                        onChange={(e) => update('projectAddress.house', e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                                            isEditing
                                                ? 'bg-black text-white border-yellow-400'
                                                : 'bg-gray-800 text-gray-300 border-gray-600 cursor-not-allowed'
                                        }`}
                                        placeholder="12"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-yellow-400 mb-2">Индекс</label>
                                    <input
                                        type="text"
                                        value={form.projectAddress.zip}
                                        onChange={(e) => update('projectAddress.zip', e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                                            isEditing
                                                ? 'bg-black text-white border-yellow-400'
                                                : 'bg-gray-800 text-gray-300 border-gray-600 cursor-not-allowed'
                                        }`}
                                        placeholder="123456"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-yellow-400 mb-2">Заказчик</label>
                                    <input
                                        type="text"
                                        value={form.customer}
                                        onChange={(e) => update('customer', e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                                            isEditing
                                                ? 'bg-black text-white border-yellow-400'
                                                : 'bg-gray-800 text-gray-300 border-gray-600 cursor-not-allowed'
                                        }`}
                                        placeholder="Rav Barieh"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-yellow-400 mb-2">Производитель</label>
                                    <input
                                        type="text"
                                        value={form.manufacturer}
                                        onChange={(e) => update('manufacturer', e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                                            isEditing
                                                ? 'bg-black text-white border-yellow-400'
                                                : 'bg-gray-800 text-gray-300 border-gray-600 cursor-not-allowed'
                                        }`}
                                        placeholder="Alucal"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-yellow-400 mb-2">Проектировщик</label>
                                    <input
                                        type="text"
                                        value={form.designer}
                                        onChange={(e) => update('designer', e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                                            isEditing
                                                ? 'bg-black text-white border-yellow-400'
                                                : 'bg-gray-800 text-gray-300 border-gray-600 cursor-not-allowed'
                                        }`}
                                        placeholder="MTM"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-yellow-400 mb-2">Администратор</label>
                                    <input
                                        type="text"
                                        value={form.admin}
                                        onChange={(e) => update('admin', e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                                            isEditing
                                                ? 'bg-black text-white border-yellow-400'
                                                : 'bg-gray-800 text-gray-300 border-gray-600 cursor-not-allowed'
                                        }`}
                                        placeholder="Michael"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-yellow-400 mb-2">Кабланы (через запятую)</label>
                                    <input
                                        type="text"
                                        value={form.kablan.join(', ')}
                                        onChange={(e) => update('kablan', e.target.value.split(',').map(s => s.trim()))}
                                        disabled={!isEditing}
                                        className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                                            isEditing
                                                ? 'bg-black text-white border-yellow-400'
                                                : 'bg-gray-800 text-gray-300 border-gray-600 cursor-not-allowed'
                                        }`}
                                        placeholder="Rabinovich, Ivanov"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-yellow-400 mb-2">Исполнители (через запятую)</label>
                                    <input
                                        type="text"
                                        value={form.executor.join(', ')}
                                        onChange={(e) => update('executor', e.target.value.split(',').map(s => s.trim()))}
                                        disabled={!isEditing}
                                        className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                                            isEditing
                                                ? 'bg-black text-white border-yellow-400'
                                                : 'bg-gray-800 text-gray-300 border-gray-600 cursor-not-allowed'
                                        }`}
                                        placeholder="Oleg, Petrov"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                {!isEditing ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleEdit}
                                            className="w-full sm:w-auto px-6 py-3 rounded-lg border-2 border-yellow-400 text-xl font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 bg-black text-yellow-400 hover:bg-yellow-400 hover:text-black"
                                        >
                                            Редактировать
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowDeleteConfirm(true)}
                                            className="w-full sm:w-auto px-6 py-3 rounded-lg border-2 border-red-500 text-xl font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 bg-black text-red-500 hover:bg-red-500 hover:text-black"
                                        >
                                            Удалить
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`w-full sm:w-auto px-6 py-3 rounded-lg border-2 border-green-500 text-xl font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
                                                loading
                                                    ? 'opacity-60 cursor-not-allowed bg-black text-green-500'
                                                    : 'bg-black text-green-500 hover:bg-green-500 hover:text-black'
                                            }`}
                                        >
                                            {loading ? 'Сохранение...' : 'Сохранить изменения'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            disabled={loading}
                                            className="w-full sm:w-auto px-6 py-3 rounded-lg border-2 border-gray-500 текст-xl font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 bg-black text-gray-500 hover:bg-gray-500 hover:text-black disabled:opacity-50"
                                        >
                                            Отмена
                                        </button>
                                    </>
                                )}
                            </div>

                            {error && (
                                <div className="mt-4 text-red-400 text-center">
                                    {error}
                                </div>
                            )}
                        </form>
                    )}

                    {/* Delete Confirmation Modal */}
                    {showDeleteConfirm && (
                        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-4">
                            <div className="bg-gray-900 border-2 border-red-500 rounded-lg p-6 max-w-md w-full">
                                <h2 className="text-2xl font-bold text-red-500 mb-4">Подтверждение удаления</h2>
                                <p className="text-white mb-6">
                                    Вы уверены, что хотите удалить проект{' '}
                                    <span className="text-yellow-400 font-bold">
                                        {form.projectName}
                                    </span>
                                    ?
                                </p>
                                <p className="text-gray-400 text-sm mb-6">
                                    Это действие необратимо!
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleDelete}
                                        disabled={loading}
                                        className="flex-1 px-4 py-3 rounded-lg border-2 border-red-500 text-lg font-bold bg-black text-red-500 hover:bg-red-500 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Удаление...' : 'Да, удалить'}
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        disabled={loading}
                                        className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-500 text-lg font-bold bg-black text-gray-500 hover:bg-gray-500 hover:text-black transition-colors disabled:opacity-50"
                                    >
                                        Отмена
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!searchedProject && !searchLoading && (
                        <div className="text-center text-gray-400 py-12">
                            <p className="text-xl">Введите ID проекта для поиска</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default CreateEditProject
