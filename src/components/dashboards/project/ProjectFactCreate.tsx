import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../redux/types'
import type { SpecificationType } from '../../typesComponents/SpecificationType'

type FactRow = SpecificationType

const newRow = (): FactRow => ({
  name: '',
  quantity: 0,
  unit: '',
  price: 0,
  currency: 'NIS',
})

const planStorageKey = (projectId: string) => `plan:${projectId}`
const factStorageKey = (projectId: string, reportDate: string) => `fact:${projectId}:${reportDate}`

const loadPlan = (projectId: string): SpecificationType[] => {
  if (!projectId) return []
  try {
    const raw = localStorage.getItem(planStorageKey(projectId))
    if (!raw) return []
    const parsed = JSON.parse(raw) as SpecificationType[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const loadFact = (projectId: string, reportDate: string): FactRow[] => {
  if (!projectId || !reportDate) return [newRow()]
  try {
    const raw = localStorage.getItem(factStorageKey(projectId, reportDate))
    if (!raw) return [newRow()]
    const parsed = JSON.parse(raw) as FactRow[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [newRow()]
  } catch {
    return [newRow()]
  }
}

const saveFact = (projectId: string, reportDate: string, fact: FactRow[]) => {
  if (!projectId || !reportDate) return
  localStorage.setItem(factStorageKey(projectId, reportDate), JSON.stringify(fact))
}

export const ProjectFactCreate = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)

  // Идентификатор проекта и дата отчета
  const [projectId, setProjectId] = useState<string>('')
  const [reportDate, setReportDate] = useState<string>('')

  // План проекта, чтобы выбрать наименования
  const [planItems, setPlanItems] = useState<SpecificationType[]>([])

  // Факт по спецификации
  const [rows, setRows] = useState<FactRow[]>([newRow()])

  // Перечень наименований из плана
  const nameOptions = useMemo(() => {
    const set = new Set<string>()
    planItems.forEach(p => {
      if (p.name?.trim()) set.add(p.name.trim())
    })
    return Array.from(set)
  }, [planItems])

  // При смене проекта — подгружаем план, а также пытаемся подгрузить сохранённый факт (если есть дата)
  useEffect(() => {
    setPlanItems(loadPlan(projectId))
  }, [projectId])

  // При выборе даты отчета — пробуем подгрузить сохраненный факт именно на эту дату
  useEffect(() => {
    if (!projectId || !reportDate) {
      setRows([newRow()])
      return
    }
    setRows(loadFact(projectId, reportDate))
  }, [projectId, reportDate])

  const UNIT_OPTIONS = useMemo(() => ['шт', 'm²', 'пм'], [])

  // Вычисления сумм
  const rowTotal = (r: FactRow) => Number(r.quantity) * Number(r.price)
  const grandTotal = useMemo(() => rows.reduce((s, r) => s + rowTotal(r), 0), [rows])

  // Операции со строками
  const addRow = () => setRows(prev => [...prev, newRow()])
  const removeRow = (idx: number) => setRows(prev => prev.filter((_, i) => i !== idx))

  const updateRow = <K extends keyof FactRow>(idx: number, field: K, value: FactRow[K]) => {
    setRows(prev => {
      const copy = prev.slice()
      copy[idx] = { ...copy[idx], [field]: value }
      return copy
    })
  }

  // При выборе наименования — подтягиваем из плана unit/price/currency
  const handleSelectName = (idx: number, name: string) => {
    const planSample = planItems.find(p => p.name === name)
    setRows(prev => {
      const copy = prev.slice()
      const current = copy[idx] || newRow()
      copy[idx] = {
        ...current,
        name,
        unit: planSample?.unit ?? current.unit,
        price: planSample?.price ?? current.price,
        currency: planSample?.currency ?? current.currency,
      }
      return copy
    })
  }

  // Сохранение факта
  const handleSave = () => {
    saveFact(projectId, reportDate, rows)
    navigate('/dashboard/project')
  }

  const headerTitle = 'Факт проекта — создание'

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
            {/* Идентификатор проекта */}
            <section className="flex flex-col gap-2">
              <label htmlFor="projectId" className="text-sm font-medium text-yellow-400">
                ID проекта
              </label>
              <input
                id="projectId"
                type="text"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value.trim())}
                className="w-full sm:w-96 bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Введите ID проекта"
              />
              <p className="text-xs text-gray-400">
                Наименования факта берутся из сохранённого плана для этого ID.
              </p>
            </section>

            {/* Дата отчета */}
            <section className="flex flex-col gap-2">
              <label htmlFor="reportDate" className="text-sm font-medium text-yellow-400">Дата отчета</label>
              <input
                id="reportDate"
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="w-full sm:w-72 bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </section>

            {/* Редактор факта: наименование выбирается из плана */}
            <section className="border-2 border-yellow-400 rounded-lg overflow-hidden">
              <header className="px-4 sm:px-6 py-3 border-b border-yellow-400 flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-yellow-400">Спецификация (Факт)</h3>
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
                  <div className="col-span-3">Наименование (из плана)</div>
                  <div className="col-span-2">Количество</div>
                  <div className="col-span-2">Ед. изм.</div>
                  <div className="col-span-2">Цена</div>
                  <div className="col-span-2">Валюта</div>
                  <div className="col-span-1 text-right">Сумма</div>
                </div>

                {rows.length === 0 && (
                  <div className="text-gray-400">Нет строк. Добавьте первую.</div>
                )}

                {rows.map((row, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                    <select
                      value={row.name}
                      onChange={(e) => handleSelectName(idx, e.target.value)}
                      className="col-span-3 bg-black text-white border-2 border-yellow-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      aria-label="Наименование позиции"
                      disabled={nameOptions.length === 0}
                    >
                      <option value="" disabled>
                        {nameOptions.length ? 'Выберите позицию из плана' : 'Нет сохранённого плана'}
                      </option>
                      {nameOptions.map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>

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
                Итого по факту: <span className="text-white">{grandTotal.toLocaleString()}</span>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!projectId || !reportDate}
                  className="px-6 py-3 rounded-lg border-2 border-yellow-400 text-yellow-400 bg-black text-lg font-bold hover:bg-yellow-400 hover:text-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Сохранить факт
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/project')}
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

export default ProjectFactCreate