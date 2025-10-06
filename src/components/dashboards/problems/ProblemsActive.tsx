import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../redux/types'
import type { AlarmType } from '../../typesComponents/AlarmType'

export const ProblemsActive = () => {
    const navigate = useNavigate()
    const { user } = useSelector((state: RootState) => state.auth)

    // TODO Замените демо-данные на загрузку из Redux/сервера
    const allRequests = useMemo<AlarmType[]>(
        () => [
            {
                id: 'AL-2025-001',
                project: { id: '20250912oron', projectName: 'Oron' },
                user: { id: 'u1', fullName: { firstName: 'Oleg', lastName: 'Ivanov' } },
                dateCreate: '2025-09-18',
                status: 'active',
                title: 'no material',
                description: 'Отсутствует партия крепежа для фасада А',
            },
            {
                id: 'AL-2025-002',
                project: { id: '20251001alpha', projectName: 'Alpha' },
                user: { id: 'u2', fullName: { firstName: 'Anna', lastName: 'Petrova' } },
                dateCreate: '2025-10-03',
                status: 'done',
                title: 'no ready',
                description: 'Чертеж узла не готов. Заявка закрыта.',
            },
            {
                id: 'AL-2025-003',
                project: { id: '20251120balc', projectName: 'SeaView' },
                user: { id: 'u3', fullName: { firstName: 'Michael', lastName: 'Levi' } },
                dateCreate: '2025-12-02',
                status: 'active',
                title: 'other',
                description: 'Необходим подъёмник для работ на высоте',
            },
            {
                id: 'AL-2025-004',
                project: { id: '20250912oron', projectName: 'Oron' },
                user: { id: 'u4', fullName: { firstName: 'Dana', lastName: 'Cohen' } },
                dateCreate: '2025-12-05',
                status: 'active',
                title: 'umit',
                description: 'Несоответствие размерам элементов облицовки',
            },
        ],
        []
    )

    // Перечень доступных проектов (из существующих заявок)
    const projectOptions = useMemo(
        () => {
            const map = new Map<string, string>()
            for (const r of allRequests) {
                map.set(r.project.id, r.project.projectName)
            }
            return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
        },
        [allRequests]
    )

    // Выбранные проекты (по умолчанию — все)
    const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>(
        () => projectOptions.map(p => p.id)
    )

    const handleProjectsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const options = Array.from(e.target.selectedOptions)
        setSelectedProjectIds(options.map(o => o.value))
    }

    // "В обработке" = статус active, плюс фильтрация по выбранным проектам
    const processingRequests = useMemo(
        () =>
            allRequests.filter(
                (r) => r.status === 'active' && (selectedProjectIds.length === 0 || selectedProjectIds.includes(r.project.id))
            ),
        [allRequests, selectedProjectIds]
    )

    const headerTitle = 'Заявки в обработке'

    return (
        <div className="min-h-screen w-full bg-black text-white">
            <header className="bg-gray-900 border-b border-yellow-400 py-4 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <h1 className="text-xl sm:text-2xl font-bold text-yellow-400">{headerTitle}</h1>
                    <div className="flex items-center space-x-4">
                        <span className="hidden sm:inline text-white">Привет, {user?.name || 'Пользователь'}</span>
                        <button
                            onClick={() => navigate('/dashboard/alarm')}
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
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-yellow-400">Проекты для отображения</label>
                                <select
                                    multiple
                                    value={selectedProjectIds}
                                    onChange={handleProjectsChange}
                                    className="min-w-64 w-full sm:w-96 h-28 bg-black text-white border-2 border-yellow-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                >
                                    {projectOptions.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.name} — {p.id}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-400">
                                    Удерживайте Ctrl/Cmd для выбора нескольких проектов.
                                </p>
                            </div>

                            <div className="text-yellow-400">
                                В обработке:{' '}
                                <span className="font-semibold text-white">{processingRequests.length}</span>
                            </div>
                        </div>

                        {processingRequests.length === 0 ? (
                            <div className="text-gray-400">Нет заявок в обработке по выбранным проектам.</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {processingRequests.map((req) => (
                                    <article
                                        key={req.id}
                                        className="border-2 border-yellow-400 rounded-lg overflow-hidden bg-black flex flex-col"
                                    >
                                        <header className="px-4 py-3 border-b border-yellow-400 flex items-center justify-between">
                                            <h3 className="text-yellow-400 text-lg font-bold">Заявка {req.id}</h3>
                                            <span className="text-xs px-2 py-1 rounded border border-yellow-400 text-yellow-400">
                        ACTIVE
                      </span>
                                        </header>

                                        <div className="p-4 flex flex-col gap-3 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-300">Проект</span>
                                                <span className="text-white font-medium">
                          {req.project.projectName} — {req.project.id}
                        </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-300">Создана</span>
                                                <span className="text-white font-medium">{req.dateCreate}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-300">Тип</span>
                                                <span className="text-white font-medium">{req.title}</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-gray-300">Описание</span>
                                                <p className="text-white/90">{req.description}</p>
                                            </div>
                                        </div>

                                        <footer className="px-4 py-3 border-t border-yellow-400 flex items-center justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={() => navigate('/dashboard/alarm/request')}
                                                className="px-3 py-2 rounded-lg border-2 border-yellow-400 text-yellow-400 bg-black font-semibold hover:bg-yellow-400 hover:text-black transition-colors"
                                                title="Открыть"
                                            >
                                                Открыть
                                            </button>
                                        </footer>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ProblemsActive

