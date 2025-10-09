import React, {useEffect, useMemo} from 'react'
import {useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import type {RootState} from '../../../redux/types.ts'
import type {AlarmType} from '../../typesComponents/AlarmType'
import type { AppDispatch } from '../../../redux/store'
import { setForm as setProblemsForm, updateByPath as updateProblemsByPath } from '../../../redux/slices/problemsRequestSlice'

export const ProblemsRequestCreate = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const {user} = useSelector((state: RootState) => state.auth)
    const form = useSelector((state: RootState) => state.problemsRequest.form)

    // Ключ для localStorage
    const storageKey = useMemo(() => (id: string) => `alarmDraft:${id}`, [])

    // Загрузка драфта при монтировании
    useEffect(() => {
        try {
            const raw = localStorage.getItem(storageKey(form.id))
            if (raw) {
                const parsed = JSON.parse(raw) as AlarmType
                dispatch(setProblemsForm({ ...parsed, status: 'draft' }))
            } else if (user) {
                const [first, last] = (user.name ?? 'User').split(' ')
                dispatch(updateProblemsByPath({ path: 'user.id', value: user.id ?? 'current' }))
                dispatch(updateProblemsByPath({ path: 'user.fullName.firstName', value: first || 'User' }))
                dispatch(updateProblemsByPath({ path: 'user.fullName.lastName', value: last || '' }))
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.warn('Не удалось загрузить драфт проблемы:', e)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const saveDraft = (data: AlarmType) => {
        try {
            const draft: AlarmType = {...data, status: 'draft'}
            localStorage.setItem(storageKey(draft.id), JSON.stringify(draft))
            // eslint-disable-next-line no-console
            console.log('Драфт проблемы сохранён:', draft)
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Ошибка сохранения драфта проблемы:', e)
        }
    }

    const clearDraft = (id: string) => {
        try {
            localStorage.removeItem(storageKey(id))
        } catch {
            // ignore
        }
    }

    const updateField = (path: string, value: unknown) => {
        dispatch(updateProblemsByPath({ path, value }))
    }


    // Сохранение драфта (остаемся на странице)
    const handleSaveDraft = (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        saveDraft({...form, status: 'draft'})
    }

    // Отправка — статус active и выход
    const handleSend = async () => {
        const payload = {...form, status: 'active' as const}
        // eslint-disable-next-line no-console
        console.log('Проблема отправлена (status=active):', payload)
        clearDraft(form.id)
        navigate('/dashboard/alarm')
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        handleSaveDraft()
    }

    return (
        <div className="min-h-screen w-full bg-black text-white">
            <header className="bg-gray-900 border-b border-yellow-400 py-4 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <h1 className="text-xl sm:text-2xl font-bold text-yellow-400">
                        Создать заявку проблемы
                    </h1>
                    <div className="flex items-center space-x-4">
    <span className="hidden sm:inline text-white">
        Привет, {user?.name || 'Пользователь'}
    </span>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-yellow-400 text-black px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-[1.3125rem] sm:text-2xl font-medium hover:bg-yellow-300"
                        >
                            Назад
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-gray-900 border-2 border-yellow-400 rounded-lg p-4 sm:p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-yellow-400 mb-2">ID заявки</label>
                                <input
                                    type="text"
                                    value={form.id}
                                    onChange={(e) => updateField('id', e.target.value)}
                                    onBlur={() => saveDraft({...form, status: 'draft'})}
                                    className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    placeholder="ALM-0001"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-yellow-400 mb-2">ID проекта</label>
                                <input
                                    type="text"
                                    value={form.project.id}
                                    onChange={(e) => updateField('project.id', e.target.value)}
                                    className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    placeholder="20250912oron"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-yellow-400 mb-2">Проект</label>
                                <input
                                    type="text"
                                    value={form.project.projectName}
                                    onChange={(e) => updateField('project.projectName', e.target.value)}
                                    className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    placeholder="Oron"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-yellow-400 mb-2">Пользователь
                                    ID</label>
                                <input
                                    type="text"
                                    value={form.user.id}
                                    onChange={(e) => updateField('user.id', e.target.value)}
                                    className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    placeholder="user-123"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-yellow-400 mb-2">Имя</label>
                                    <input
                                        type="text"
                                        value={(form.user.fullName as any)?.firstName ?? ''}
                                        onChange={(e) => updateField('user.fullName.firstName', e.target.value)}
                                        className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                        placeholder="Michael"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-yellow-400 mb-2">Фамилия</label>
                                    <input
                                        type="text"
                                        value={(form.user.fullName as any)?.lastName ?? ''}
                                        onChange={(e) => updateField('user.fullName.lastName', e.target.value)}
                                        className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                        placeholder="Ivanov"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-yellow-400 mb-2">Дата создания</label>
                                <input
                                    type="date"
                                    value={form.dateCreate}
                                    onChange={(e) => updateField('dateCreate', e.target.value)}
                                    className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                            </div>

                            {/* Статус — только просмотр, изначально 'draft' */}
                            <div>
                                <label className="block text-sm font-medium text-yellow-400 mb-2">Статус</label>
                                <input
                                    type="text"
                                    value={form.status}
                                    readOnly
                                    className="w-full bg-black text-gray-300 border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none"
                                />
                                <p className="text-xs text-gray-400 mt-1">Статус меняется на «active» при отправке.</p>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-yellow-400 mb-2">Заголовок</label>
                                <select
                                    value={form.title}
                                    onChange={(e) => updateField('title', e.target.value as AlarmType['title'])}
                                    className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                >
                                    <option value="umit">umit</option>
                                    <option value="no ready">no ready</option>
                                    <option value="no material">no material</option>
                                    <option value="other">other</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-yellow-400 mb-2">Описание</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => updateField('description', e.target.value)}
                                    className="w-full min-h-[120px] bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    placeholder="Опишите проблему подробно..."
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-6 py-3 rounded-lg border-2 border-yellow-400 text-yellow-400 bg-black text-xl font-bold hover:bg-yellow-400 hover:text-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                                title="Сохранить как черновик"
                            >
                                Сохранить
                            </button>
                            <button
                                type="button"
                                onClick={handleSend}
                                className="w-full sm:w-auto px-6 py-3 rounded-lg border-2 border-yellow-400 text-black bg-yellow-400 text-xl font-bold hover:bg-yellow-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                                title="Отправить и перевести статус в active"
                            >
                                Отправить
                            </button>

                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default ProblemsRequestCreate
