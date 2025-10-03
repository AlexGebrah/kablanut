import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../redux/types.ts'
import type { ProjectType } from '../../typesComponents/ProjectType'
import type { SpecificationType } from '../../typesComponents/SpecificationType'

// Локальный тип строки спецификации с наименованием
type SpecRow = SpecificationType

const newRow = (): SpecRow => ({
    name: '',
    quantity: 0,
    unit: '',
    price: 0,
    currency: 'NIS',
})

export const ProjectPlanCreate = () => {
    const navigate = useNavigate()
    const { user } = useSelector((state: RootState) => state.auth)

    // В демо — список активных проектов (можете заменить на реальные данные)
    const activeProjects = useMemo<ProjectType[]>(() => {
        const base: Omit<ProjectType, 'specificationPlan' | 'specificationFact'> = {
            id: '20250912oron',
            projectName: 'Oron',
            projectKind: "HPL",
            projectDateStart: '2025-08-12',
            projectDateFinish: '2026-02-21',
            projectAddress: { city: 'Bat Yam', street: 'Balfur', house: '33', zip: '123456', room: '12' },
            projectStatus: 'active',
            customer: 'Rav Barieh',
            manufacturer: 'Alucal',
            kablan: ['Rabinovich'],
            designer: 'MTM',
            executor: ['Oleg'],
            admin: 'Michael',
        }
        return [
            {
                ...base,
                specificationPlan: [],
                specificationFact: [],
            },
            {
                ...base,
                id: '20251001alpha',
                projectName: 'Alpha',
                projectKind: "ALUMINIUM",
                specificationPlan: [],
                specificationFact: [],
            },
            {
                ...base,
                id: '20251120balc',
                projectName: 'SeaView',
                projectKind: "BALCON",
                specificationPlan: [],
                specificationFact: [],
            },
        ].filter(p => p.projectStatus === 'active')
    }, [])

    // Текущее выбранное состояние
    const [selectedProjectId, setSelectedProjectId] = useState<string>(activeProjects[0]?.id ?? '')
    const selectedProject = useMemo(
        () => activeProjects.find(p => p.id === selectedProjectId),
        [activeProjects, selectedProjectId]
    )

    // Редактируем ПЛАН как простой список позиций с наименованием
    const [planRows, setPlanRows] = useState<SpecRow[]>([newRow()])

    const handleProjectChange = (projectId: string) => {
        setSelectedProjectId(projectId)
        // По требованию — не подгружаем автоматически, начинаем с пустого плана
        setPlanRows([newRow()])
    }

    const addRow = () => setPlanRows(prev => [...prev, newRow()])

    const removeRow = (idx: number) => {
        setPlanRows(prev => prev.filter((_, i) => i !== idx))
    }

    const updateRow = <K extends keyof SpecRow>(idx: number, key: K, value: SpecRow[K]) => {
        setPlanRows(prev => {
            const copy = prev.slice()
            copy[idx] = { ...copy[idx], [key]: value }
            return copy
        })
    }

    const UNIT_OPTIONS = useMemo(() => ['шт', 'm²', 'пм'], [])

    const rowTotal = (row: SpecRow) => Number(row.quantity) * Number(row.price)
    const grandTotal = useMemo(
        () => planRows.reduce((s, r) => s + rowTotal(r), 0),
        [planRows]
    )

    const handleSavePlan = () => {
        // Приводим к типу ProjectType: наименование вводится, но не хранится в SpecificationItem
        const specificationPlan: SpecificationType[] = planRows.map(({ ...rest }) => rest)
        const payload = {
            projectId: selectedProjectId,
            projectName: selectedProject?.projectName,
            projectKind: selectedProject?.projectKind,
            specificationPlan,
        }
        // TODO: сохранить в Redux/сервер
        // eslint-disable-next-line no-console
        console.log('ProjectPlanCreate — сохранение плана:', payload)
        navigate('/dashboard/project')
    }

    const headerTitle = 'План проекта — создание'

    return (
        <div className="min-h-screen w-full bg-black text-white">
            <header className="bg-gray-900 border-b border-yellow-400 py-4 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <h1 className="text-xl sm:text-2xl font-bold text-yellow-400">
                        {headerTitle}
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
                    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
                        {/* Выбор проекта */}
                        <section className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-yellow-400">Проект (активный)</label>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <select
                                    value={selectedProjectId}
                                    onChange={(e) => handleProjectChange(e.target.value)}
                                    className="w-full sm:w-96 bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                >
                                    {activeProjects.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.projectName} — {p.id}
                                        </option>
                                    ))}
                                </select>
                                <div className="text-sm text-gray-300 self-center">
                                    Тип проекта: <span className="text-yellow-400 font-semibold">{selectedProject?.projectKind || '-'}</span>
                                </div>
                            </div>
                        </section>

                        {/* Редактор плана: плоский список позиций с наименованием */}
                        <section className="border-2 border-yellow-400 rounded-lg overflow-hidden">
                            <header className="px-4 sm:px-6 py-3 border-b border-yellow-400 flex items-center justify-between">
                                <h3 className="text-lg sm:text-xl font-bold text-yellow-400">Спецификация (План)</h3>
                                <div className="flex items-center gap-3">
                                    <span className="text-yellow-400 font-semibold">
                                        Итого: {grandTotal.toLocaleString()}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={addRow}
                                        className="px-3 py-1.5 rounded-md border-2 border-yellow-400 text-yellow-400 bg-black font-semibold hover:bg-yellow-400 hover:text-black transition-colors"
                                    >
                                        Добавить строку
                                    </button>
                                </div>
                            </header>

                            <div className="p-3 sm:p-4 flex flex-col gap-3">
                                <div className="grid grid-cols-12 gap-2 text-yellow-400 font-semibold">
                                    <div className="col-span-3">Наименование</div>
                                    <div className="col-span-2">Количество</div>
                                    <div className="col-span-2">Ед. изм.</div>
                                    <div className="col-span-2">Цена</div>
                                    <div className="col-span-2">Валюта</div>
                                    <div className="col-span-1 text-right">Сумма</div>
                                </div>

                                {planRows.length === 0 && (
                                    <div className="text-gray-400">Нет строк. Добавьте первую.</div>
                                )}

                                {planRows.map((row, idx) => (
                                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                                        <input
                                            type="text"
                                            value={row.name}
                                            onChange={(e) => updateRow(idx, 'name', e.target.value)}
                                            className="col-span-3 bg-black text-white border-2 border-yellow-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                            placeholder="Наименование позиции"
                                        />
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            value={row.quantity}
                                            onChange={(e) => updateRow(idx, 'quantity', Number(e.target.value) || 0)}
                                            className="col-span-2 bg-black text-white border-2 border-yellow-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                            placeholder="0"
                                        />
                                        <select
                                            value={row.unit}
                                            onChange={(e) => updateRow(idx, 'unit', e.target.value)}
                                            className="col-span-2 bg-black text-white border-2 border-yellow-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                            aria-label="Единица измерения"
                                        >
                                            <option value="" disabled>Выберите ед. изм.</option>
                                            {UNIT_OPTIONS.map(u => (
                                                <option key={u} value={u}>{u}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            value={row.price}
                                            onChange={(e) => updateRow(idx, 'price', Number(e.target.value) || 0)}
                                            className="col-span-2 bg-black text-white border-2 border-yellow-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                            placeholder="0"
                                        />
                                        <input
                                            type="text"
                                            value={row.currency}
                                            onChange={(e) => updateRow(idx, 'currency', e.target.value)}
                                            className="col-span-2 bg-black text-white border-2 border-yellow-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                            placeholder="NIS"
                                        />
                                        <div className="col-span-1 flex items-center justify-between gap-2">
                                            <span className="text-yellow-400 font-semibold whitespace-nowrap">
                                                {rowTotal(row).toLocaleString()}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => removeRow(idx)}
                                                className="px-3 py-2 rounded-lg border-2 border-yellow-400 text-black bg-yellow-400 font-semibold hover:bg-yellow-300 transition-colors"
                                                aria-label={`Удалить строку ${idx + 1}`}
                                                title="Удалить"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Действия */}
                        <section className="bg-black/40 border border-yellow-400 rounded-lg p-4 sm:p-6 flex items-center justify-between">
                            <div className="text-lg font-semibold text-yellow-400">
                                Итого по плану: <span className="text-white">{grandTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleSavePlan}
                                    className="px-6 py-3 rounded-lg border-2 border-yellow-400 text-yellow-400 bg-black text-lg font-bold hover:bg-yellow-400 hover:text-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                                >
                                    Сохранить план
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard')}
                                    className="px-6 py-3 rounded-lg border-2 border-yellow-400 text-black bg-yellow-400 text-lg font-bold hover:bg-yellow-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                                >
                                    Отмена
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ProjectPlanCreate
