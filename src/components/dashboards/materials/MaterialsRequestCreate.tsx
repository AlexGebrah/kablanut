import React, {useEffect, useMemo, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
import type {RootState} from '../../../redux/types.ts'
import type {MaterialsType, MaterialItem} from '../../typesComponents/MaterialsType'

export const MaterialsRequestCreate = () => {
    const navigate = useNavigate()
    const {user} = useSelector((state: RootState) => state.auth)

    // Генерация ключа хранения драфта в localStorage по id заявки
    const storageKey = useMemo(() => (id: string) => `materialsDraft:${id}`, [])

    // Начальные данные формы: статус только 'draft'
    const [form, setForm] = useState<MaterialsType>({
        id: 'MRQ-0001',
        project: {id: '20250912oron'},
        user: {
            id: user?.id ?? 'current',
            fullName: user?.name
                ? {firstName: user.name.split(' ')[0] ?? 'User', lastName: user.name.split(' ')[1] ?? ''}
                : {firstName: 'User', lastName: ''},
        } as any,
        items: [
            {materialName: 'Панель HPL', quantity: 10, unit: 'шт'},
        ],
        dateCreate: new Date().toISOString().slice(0, 10),
        status: 'draft',
    })

    // Загрузка драфта при монтировании (если есть сохранённый)
    useEffect(() => {
        try {
            const raw = localStorage.getItem(storageKey(form.id))
            if (raw) {
                const parsed = JSON.parse(raw) as MaterialsType
                // Статус драфта принудительно 'draft'
                setForm({...parsed, status: 'draft'})
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.warn('Не удалось загрузить драфт заявки материалов:', e)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Сохранение драфта (ручное, по кнопке)
    const saveDraft = (data: MaterialsType) => {
        try {
            const draft: MaterialsType = {...data, status: 'draft'}
            localStorage.setItem(storageKey(draft.id), JSON.stringify(draft))
            // eslint-disable-next-line no-console
            console.log('Драфт сохранён:', draft)
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Ошибка сохранения драфта заявки материалов:', e)
        }
    }

    // Очистка драфта после отправки
    const clearDraft = (id: string) => {
        try {
            localStorage.removeItem(storageKey(id))
        } catch {
            // ignore
        }
    }

    const updateField = (path: string, value: unknown) => {
        setForm(prev => {
            const next: any = {...prev}
            const parts = path.split('.')
            let cursor = next
            for (let i = 0; i < parts.length - 1; i++) {
                const key = parts[i]
                cursor[key] = Array.isArray(cursor[key]) ? [...cursor[key]] : {...cursor[key]}
                cursor = cursor[key]
            }
            cursor[parts[parts.length - 1]] = value
            return next
        })
    }

    const addItem = () => {
        setForm(prev => ({
            ...prev,
            items: [...prev.items, {materialName: '', quantity: 0, unit: ''}],
        }))
    }

    const removeItem = (index: number) => {
        setForm(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index),
        }))
    }

    const updateItem = <K extends keyof MaterialItem>(index: number, key: K, value: MaterialItem[K]) => {
        setForm(prev => {
            const items = prev.items.slice()
            items[index] = {...items[index], [key]: value}
            return {...prev, items}
        })
    }

    // Сохранить драфт (остаёмся на странице, статус не меняем)
    const handleSaveDraft = (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        saveDraft({...form, status: 'draft'})
    }

    // Кнопка "Отправить": меняем статус на 'active', очищаем драфт и уходим
    const handleSend = async () => {
        // Можно добавить валидацию перед отправкой
        const payload = {...form, status: 'active' as const}
        // eslint-disable-next-line no-console
        console.log('MaterialsRequestCreate sent (status=active):', payload)
        clearDraft(form.id)
        navigate('/dashboard/materials')
    }

    // Перехватываем submit формы как "сохранить драфт"
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        handleSaveDraft()
    }

    return (
        <div className="min-h-screen w-full bg-black text-white">
            <header className="bg-gray-900 border-b border-yellow-400 py-4 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <h1 className="text-xl sm:text-2xl font-bold text-yellow-400">
                        Заявка материалов — создать
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
                                    className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    placeholder="MRQ-0001"
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
                        </div>

                        <div className="mt-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-yellow-400">Позиции</h2>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="px-4 py-2 rounded-lg border-2 border-yellow-400 text-yellow-400 bg-black font-semibold hover:bg-yellow-400 hover:text-black transition-colors"
                                >
                                    Добавить позицию
                                </button>
                            </div>

                            <div className="flex flex-col gap-4">
                                {form.items.length === 0 && (
                                    <div className="text-gray-400">Позиции отсутствуют</div>
                                )}
                                {form.items.map((it, idx) => (
                                    <div
                                        key={idx}
                                        className="grid grid-cols-1 md:grid-cols-12 gap-3 border border-yellow-400/60 rounded-lg p-3"
                                    >
                                        <div className="md:col-span-6">
                                            <label
                                                className="block text-sm font-medium text-yellow-400 mb-1">Материал</label>
                                            <input
                                                type="text"
                                                value={it.materialName}
                                                onChange={(e) => updateItem(idx, 'materialName', e.target.value)}
                                                className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                placeholder="Панель HPL"
                                            />
                                        </div>
                                        <div className="md:col-span-3">
                                            <label
                                                className="block text-sm font-medium text-yellow-400 mb-1">Кол-во</label>
                                            <input
                                                type="number"
                                                value={it.quantity}
                                                onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))}
                                                className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                placeholder="0"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label
                                                className="block text-sm font-medium text-yellow-400 mb-1">Ед.</label>
                                            <input
                                                type="text"
                                                value={it.unit}
                                                onChange={(e) => updateItem(idx, 'unit', e.target.value)}
                                                className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                placeholder="шт"
                                            />
                                        </div>
                                        <div className="md:col-span-1 flex items-end">
                                            <button
                                                type="button"
                                                onClick={() => removeItem(idx)}
                                                className="w-full md:w-auto px-3 py-2 rounded-lg border-2 border-yellow-400 text-black bg-yellow-400 font-semibold hover:bg-yellow-300 transition-colors"
                                                aria-label={`Удалить позицию ${idx + 1}`}
                                                title="Удалить"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-6 py-3 rounded-lg border-2 border-yellow-400 text-yellow-400 bg-black text-xl font-bold hover:bg-yellow-400 hover:text-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                            >
                                Сохранить
                            </button>
                            <button
                                type="button"
                                onClick={handleSend}
                                className="w-full sm:w-auto px-6 py-3 rounded-lg border-2 border-yellow-400 text-black bg-yellow-400 text-xl font-bold hover:bg-yellow-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                                title="Отправить заявку и перевести статус в active"
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

export default MaterialsRequestCreate
