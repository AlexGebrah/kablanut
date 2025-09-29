import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../redux/types.ts'
import type { ProjectKind, ProjectType, SpecificationFor } from '../../typesComponents/ProjectType'
import type { SpecificationItem } from '../../typesComponents/TypeSpecificationItem'
import {
    PROJECT_KIND_ALUMINIUM,
    PROJECT_KIND_BALCON,
    PROJECT_KIND_HPL,
} from '../../../constants/TypeConstants.ts'


type SpecPlanFor<K extends ProjectKind> = SpecificationFor<K>

const newItem = (): SpecificationItem => ({
    quantity: 0,
    unit: '',
    price: 0,
    currency: 'NIS',
})

function createEmptyPlan<K extends ProjectKind>(kind: K): SpecPlanFor<K> {
    if (kind === PROJECT_KIND_HPL) {
        return {
            structures: [newItem()],
            panels: [newItem()],
            glif: [newItem()],
        } as SpecPlanFor<K>
    }
    if (kind === PROJECT_KIND_ALUMINIUM) {
        return {
            panels: [newItem()],
            glif: [newItem()],
        } as SpecPlanFor<K>
    }

    return {
        pillars: [newItem()],
        aluminium: [newItem()],
        ushka: [newItem()],
        glass: [newItem()],
    } as SpecPlanFor<K>
}

export const ProjectPlanCreate = () => {
    const navigate = useNavigate()
    const { user } = useSelector((state: RootState) => state.auth)

    // Список активных проектов пользователя (эмуляция, замените на реальные данные/Redux)
    //TODO
    const activeProjects = useMemo<ProjectType<ProjectKind>[]>(() => {
        return [
            {
                id: '20250912oron',
                projectName: 'Oron',
                projectKind: PROJECT_KIND_HPL,
                projectDateStart: '2025-08-12',
                projectDateFinish: '2026-02-21',
                specificationPlan: createEmptyPlan(PROJECT_KIND_HPL),
                specificationFact: createEmptyPlan(PROJECT_KIND_HPL),
                projectAddress: { city: 'Bat Yam', street: 'Balfur', house: "33", zip: "123456", room: "12" },
                projectStatus: 'active',
                customer: 'Rav Barieh',
                manufacturer: 'Alucal',
                kablan: ['Rabinovich'],
                designer: 'MTM',
                executor: ['Oleg'],
                admin: 'Michael',
            } as ProjectType<typeof PROJECT_KIND_HPL>,
            {
                id: '20251001alpha',
                projectName: 'Alpha',
                projectKind: PROJECT_KIND_ALUMINIUM,
                projectDateStart: '2025-10-01',
                projectDateFinish: '2026-05-01',
                specificationPlan: createEmptyPlan(PROJECT_KIND_ALUMINIUM),
                specificationFact: createEmptyPlan(PROJECT_KIND_ALUMINIUM),
                projectAddress: { city: 'Tel-Aviv', street: 'Herzl', house: "10", zip: "123123", room: "1" },
                projectStatus: 'active',
                customer: 'ACME',
                manufacturer: 'MetalWorks',
                kablan: ['Cohen'],
                designer: 'DesignCo',
                executor: ['Anna'],
                admin: 'Michael',
            } as ProjectType<typeof PROJECT_KIND_ALUMINIUM>,
            {
                id: '20251120balc',
                projectName: 'SeaView',
                projectKind: PROJECT_KIND_BALCON,
                projectDateStart: '2025-11-20',
                projectDateFinish: '2026-07-15',
                specificationPlan: createEmptyPlan(PROJECT_KIND_BALCON),
                specificationFact: createEmptyPlan(PROJECT_KIND_BALCON),
                projectAddress: { city: 'Haifa', street: 'Dizingoff', house: "7", zip: "111111", room: "3" },
                projectStatus: 'active',
                customer: 'Sea Corp',
                manufacturer: 'GlassTech',
                kablan: ['Levi'],
                designer: 'SkyLine',
                executor: ['Oleg', 'Anna'],
                admin: 'Michael',
            } as ProjectType<typeof PROJECT_KIND_BALCON>,
        ].filter(p => p.projectStatus === 'active')
    }, [])

    // Выбор проекта и типа (К)
    const [selectedProjectId, setSelectedProjectId] = useState<string>(activeProjects[0]?.id ?? '')
    const selectedProject = useMemo(
        () => activeProjects.find(p => p.id === selectedProjectId),
        [activeProjects, selectedProjectId]
    )
    const [kind, setKind] = useState<ProjectKind>(selectedProject?.projectKind ?? PROJECT_KIND_HPL)
    const [plan, setPlan] = useState<SpecPlanFor<ProjectKind>>(() => createEmptyPlan(kind))

    // При смене проекта — обновляем тип и очищаем план под него
    const handleProjectChange = (projectId: string) => {
        setSelectedProjectId(projectId)
        const proj = activeProjects.find(p => p.id === projectId)
        const nextKind: ProjectKind = proj?.projectKind ?? PROJECT_KIND_HPL
        setKind(nextKind)
        setPlan(createEmptyPlan(nextKind))
    }

    // При смене типа — чистим план
    const handleKindChange = (nextKind: ProjectKind) => {
        setKind(nextKind)
        setPlan(createEmptyPlan(nextKind))
    }

    // Работа со строками в секциях
    const addRow = (section: string) => {
        setPlan(prev => {
            const next: any = { ...(prev as any) }
            const arr = (next[section] as SpecificationItem[]) ?? []
            next[section] = [...arr, newItem()]
            return next
        })
    }

    const removeRow = (section: string, idx: number) => {
        setPlan(prev => {
            const next: any = { ...(prev as any) }
            const arr = (next[section] as SpecificationItem[]) ?? []
            next[section] = arr.filter((_, i) => i !== idx)
            return next
        })
    }

    const updateRow = (
        section: string,
        idx: number,
        key: keyof SpecificationItem,
        value: string
    ) => {
        setPlan(prev => {
            const next: any = { ...(prev as any) }
            const arr = (next[section] as SpecificationItem[]) ?? []
            const parsedVal =
                key === 'quantity' || key === 'price' ? Number(value) || 0 : value
            const row = { ...arr[idx], [key]: parsedVal }
            const copy = arr.slice()
            copy[idx] = row
            next[section] = copy
            return next
        })
    }

    const handleSavePlan = () => {
        const payload = {
            projectId: selectedProjectId,
            projectName: selectedProject?.projectName,
            projectKind: kind,
            specificationPlan: plan,
        }
        // eslint-disable-next-line no-console
        //TODO сохранение плана в Redux или на сервер
        console.log('ProjectPlanCreate — сохранение плана:', payload)
        navigate('/dashboard/project')
    }

    const headerTitle = 'План проекта — создание'

    // Секции для рендера по типу проекта
    const sections = useMemo(() => {
        if (kind === PROJECT_KIND_HPL) {
            return [
                { key: 'structures', label: 'Конструкции' },
                { key: 'panels', label: 'Панели' },
                { key: 'glif', label: 'Глиф' },
            ] as const
        }
        if (kind === PROJECT_KIND_ALUMINIUM) {
            return [
                { key: 'panels', label: 'Панели' },
                { key: 'glif', label: 'Глиф' },
            ] as const
        }
        return [
            { key: 'pillars', label: 'Столбы' },
            { key: 'aluminium', label: 'Алюминий' },
            { key: 'ushka', label: 'Ушки' },
            { key: 'glass', label: 'Стекло' },
        ] as const
    }, [kind])

    // Справочник единиц измерения для выбора
    const UNIT_OPTIONS = useMemo(
        () => ['шт', 'm²', 'пм'],
        []
    )


    // Итог по секции и общий итог (как в стиле ProjectPlanFact)
    const sectionTotal = (items?: SpecificationItem[]) =>
        (items ?? []).reduce((s, it) => s + (Number(it.quantity) * Number(it.price)), 0)
    const grandTotal = useMemo(() => {
        const p: any = plan
        return sections.reduce((sum, s) => sum + sectionTotal(p[s.key] as SpecificationItem[]), 0)
    }, [plan, sections])

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

                        {/* Кнопки выбора К */}
                        <section className="flex flex-wrap gap-3">
                            <span className="text-sm font-medium text-yellow-400 self-center">Тип спецификации (К):</span>
                            {[PROJECT_KIND_ALUMINIUM, PROJECT_KIND_BALCON, PROJECT_KIND_HPL].map(k => {
                                const active = k === kind
                                return (
                                    <button
                                        key={k}
                                        type="button"
                                        onClick={() => handleKindChange(k)}
                                        className={
                                            'px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-colors ' +
                                            (active
                                                ? 'border-yellow-400 bg-yellow-400 text-black'
                                                : 'border-yellow-400 text-yellow-400 bg-black hover:bg-yellow-400 hover:text-black')
                                        }
                                        aria-pressed={active}
                                    >
                                        {k}
                                    </button>
                                )
                            })}
                        </section>

                        {/* Редактор specificationPlan в стиле ProjectPlanFact */}
                        <section className="flex flex-col gap-8">
                            {sections.map(sec => {
                                // Избегаем any: типизируем plan как словарь секций
                                const items = (plan as Record<string, SpecificationItem[]>)[sec.key] ?? []
                                const subtotal = sectionTotal(items)
                                return (
                                    <div key={sec.key} className="border-2 border-yellow-400 rounded-lg overflow-hidden">
                                        <header className="px-4 sm:px-6 py-3 border-b border-yellow-400 flex items-center justify-between">
                                            <h3 className="text-lg sm:text-xl font-bold text-yellow-400">{sec.label}</h3>
                                            <div className="flex items-center gap-3">
                                                <span className="text-yellow-400 font-semibold">Итого: {subtotal.toLocaleString()}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => addRow(sec.key)}
                                                    className="px-3 py-1.5 rounded-md border-2 border-yellow-400 text-yellow-400 bg-black font-semibold hover:bg-yellow-400 hover:text-black transition-colors"
                                                >
                                                    Добавить строку
                                                </button>
                                            </div>
                                        </header>

                                        <div className="p-3 sm:p-4 flex flex-col gap-3">
                                            <div className="grid grid-cols-12 gap-2 text-yellow-400 font-semibold">
                                                <div className="col-span-3">Количество</div>
                                                <div className="col-span-3">Ед. изм.</div>
                                                <div className="col-span-3">Цена</div>
                                                <div className="col-span-2">Валюта</div>
                                                <div className="col-span-1" />
                                            </div>

                                            {(!items || items.length === 0) && (
                                                <div className="text-gray-400">Нет строк. Добавьте первую.</div>
                                            )}

                                            {items?.map((row, idx) => (
                                                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        pattern="[0-9]*"
                                                        value={row.quantity}
                                                        onChange={(e) => updateRow(sec.key, idx, 'quantity', e.target.value)}
                                                        className="col-span-3 bg-black text-white border-2 border-yellow-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                        placeholder="0"
                                                    />
                                                    <select
                                                        value={row.unit}
                                                        onChange={(e) => updateRow(sec.key, idx, 'unit', e.target.value)}
                                                        className="col-span-3 bg-black text-white border-2 border-yellow-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
                                                        onChange={(e) => updateRow(sec.key, idx, 'price', e.target.value)}
                                                        className="col-span-3 bg-black text-white border-2 border-yellow-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                        placeholder="0"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={row.currency}
                                                        onChange={(e) => updateRow(sec.key, idx, 'currency', e.target.value)}
                                                        className="col-span-2 bg-black text-white border-2 border-yellow-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                        placeholder="NIS"
                                                    />
                                                    <div className="col-span-1 flex items-center justify-end">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeRow(sec.key, idx)}
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
                                    </div>
                                )
                            })}
                        </section>



                        {/* Итого по плану + действия */}
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
