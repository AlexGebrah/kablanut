import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../redux/types'
import type { SpecificationType } from '../../typesComponents/SpecificationType'

type PlanRow = SpecificationType

const newRow = (): PlanRow => ({
  name: '',
  quantity: 0,
  unit: '',
  price: 0,
  currency: 'NIS',
})

const storageKey = (projectId: string) => `plan:${projectId}`

const loadPlan = (projectId: string): PlanRow[] => {
  if (!projectId) return [newRow()]
  try {
    const raw = localStorage.getItem(storageKey(projectId))
    if (!raw) return [newRow()]
    const parsed = JSON.parse(raw) as PlanRow[]
    if (!Array.isArray(parsed)) return [newRow()]
    return parsed
  } catch {
    return [newRow()]
  }
}

const savePlan = (projectId: string, plan: PlanRow[]) => {
  if (!projectId) return
  localStorage.setItem(storageKey(projectId), JSON.stringify(plan))
}

export const ProjectPlanCreate = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)

  // Текущий проект. В качестве ключа хранилища используем введённый ID проекта.
  const [projectId, setProjectId] = useState<string>('')

  // Редактируемый план ( SpecificationPlan )
  const [rows, setRows] = useState<PlanRow[]>([newRow()])

  // Обновлять план при смене текущего ID проекта
  useEffect(() => {
    setRows(loadPlan(projectId))
  }, [projectId])

  const UNIT_OPTIONS = useMemo(() => ['шт', 'm²', 'пм'], [])

  const rowTotal = (r: PlanRow) => Number(r.quantity) * Number(r.price)
  const grandTotal = useMemo(() => rows.reduce((s, r) => s + rowTotal(r), 0), [rows])

  const addRow = () => setRows(prev => [...prev, newRow()])
  const removeRow = (idx: number) => setRows(prev => prev.filter((_, i) => i !== idx))

  const updateRow = <K extends keyof PlanRow>(idx: number, field: K, value: PlanRow[K]) => {
    setRows(prev => {
      const copy = prev.slice()
      copy[idx] = { ...copy[idx], [field]: value }
      return copy
    })
  }

  const handleSave = () => {
    // Сохраняем введённые поля плана для текущего проекта
    savePlan(projectId, rows)
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
            {/* Идентификатор проекта (ключ сохранения) */}
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
                План будет сохранён локально под этим идентификатором.
              </p>
            </section>

            {/* Редактор плана в стиле ProjectPlanFact */}
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

                {rows.length === 0 && (
                  <div className="text-gray-400">Нет строк. Добавьте первую.</div>
                )}

                {rows.map((row, idx) => (
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
                  onClick={handleSave}
                  disabled={!projectId}
                  className="px-6 py-3 rounded-lg border-2 border-yellow-400 text-yellow-400 bg-black text-lg font-bold hover:bg-yellow-400 hover:text-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Сохранить план
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

export default ProjectPlanCreate