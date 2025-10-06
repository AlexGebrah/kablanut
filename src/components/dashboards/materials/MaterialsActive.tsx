import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../redux/types'
import type { MaterialsType } from '../../typesComponents/MaterialsType'


export const MaterialsActive = () => {
    const navigate = useNavigate()
    const { user } = useSelector((state: RootState) => state.auth)

    //TODO Демо-данные в формате MaterialsType. При наличии Redux/сервера — замените на реальные данные.
    const allRequests = useMemo<MaterialsType[]>(
        () => [
            {
                id: 'MR-2025-001',
                project: { id: '20250912oron' },
                user: {
                    id: 'u1',
                    fullName: { firstName: 'Oleg', lastName: 'Ivanov' },
                },
                items: [
                    { materialName: 'HPL панель 8мм', quantity: 50, unit: 'шт' },
                    { materialName: 'Крепеж', quantity: 200, unit: 'шт' },
                ],
                dateCreate: '2025-09-15',
                status: 'active',
            },
            {
                id: 'MR-2025-002',
                project: { id: '20251001alpha' },
                user: {
                    id: 'u2',
                    fullName: { firstName: 'Anna', lastName: 'Petrova' },
                },
                items: [{ materialName: 'Профиль 60x40', quantity: 120, unit: 'пм' }],
                dateCreate: '2025-10-02',
                status: 'done',
            },
            {
                id: 'MR-2025-003',
                project: { id: '20251120balc' },
                user: {
                    id: 'u3',
                    fullName: { firstName: 'Michael', lastName: 'Levi' },
                },
                items: [
                    { materialName: 'Стеклопакет 24мм', quantity: 12, unit: 'шт' },
                    { materialName: 'Герметик', quantity: 8, unit: 'шт' },
                ],
                dateCreate: '2025-11-28',
                status: 'active',
            },
        ],
        []
    )

    const activeRequests = useMemo(
        () => allRequests.filter((r) => r.status === 'active'),
        [allRequests]
    )

    const headerTitle = 'Активные заявки на материалы'

    return (
        <div className="min-h-screen w-full bg-black text-white">
            <header className="bg-gray-900 border-b border-yellow-400 py-4 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <h1 className="text-xl sm:text-2xl font-bold text-yellow-400">{headerTitle}</h1>
                    <div className="flex items-center space-x-4">
                        <span className="hidden sm:inline text-white">Привет, {user?.name || 'Пользователь'}</span>
                        <button
                            onClick={() => navigate('/dashboard/materials')}
                            className="bg-yellow-400 text-black px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-[1.3125rem] sm:text-2xl font-medium hover:bg-yellow-300"
                        >
                            Назад
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-gray-900 border-2 border-yellow-400 rounded-lg p-4 sm:p-6 md:p-8">
                    <div className="w-full flex flex-col gap-6">
                        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                            <div className="text-yellow-400">
                                Всего активных: <span className="font-semibold text-white">{activeRequests.length}</span>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard/materials/request')}
                                    className="px-4 py-2 rounded-lg border-2 border-yellow-400 text-yellow-400 bg-black font-semibold hover:bg-yellow-400 hover:text-black transition-colors"
                                >
                                    Создать заявку
                                </button>
                            </div>
                        </div>

                        {activeRequests.length === 0 ? (
                            <div className="text-gray-400">Нет активных заявок.</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {activeRequests.map((req) => {
                                    return (
                                        <article
                                            key={req.id}
                                            className="border-2 border-yellow-400 rounded-lg overflow-hidden bg-black flex flex-col"
                                        >
                                            <header className="px-4 py-3 border-b border-yellow-400 flex items-center justify-between">
                                                <h3 className="text-yellow-400 text-lg font-bold">Заявка {req.id}</h3>
                                                <span className="text-xs px-2 py-1 rounded border border-yellow-400 text-yellow-400">
                                                    {req.status.toUpperCase()}
                                                </span>
                                            </header>

                                            <div className="p-4 flex flex-col gap-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-300">Проект</span>
                                                    <span className="text-white font-medium">{req.project.id}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-300">Создана</span>
                                                    <span className="text-white font-medium">{req.dateCreate}</span>
                                                </div>
                                                {/* Наименования позиций заявки */}
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-gray-300">Позиции</span>
                                                    <ul className="list-disc list-inside text-white/90">
                                                        {req.items.map((it, i) => (
                                                            <li key={i}>{it.materialName}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            <footer className="px-4 py-3 border-t border-yellow-400 flex items-center justify-end gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => navigate('/dashboard/materials/request')}
                                                    className="px-3 py-2 rounded-lg border-2 border-yellow-400 text-yellow-400 bg-black font-semibold hover:bg-yellow-400 hover:text-black transition-colors"
                                                    title="Открыть"
                                                >
                                                    Открыть
                                                </button>
                                            </footer>
                                        </article>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default MaterialsActive

