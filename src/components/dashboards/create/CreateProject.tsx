import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
import type {RootState} from '../../../redux/types.ts'
import type {ProjectType} from "../../typesComponents/ProjectType.ts";
import {PROJECT_KIND_HPL} from "../../../constants/TypeConstants.ts";


export const CreateProject = () => {
    const navigate = useNavigate()
    const {user} = useSelector((state: RootState) => state.auth)

    const [form, setForm] = useState<ProjectType>({
        id: '20250912oron',
        projectName: 'Oron',
        projectKind: PROJECT_KIND_HPL,
        projectDateStart: '2025-08-12',
        projectDateFinish: '2026-02-21',
        customer: 'Rav Barieh',
        manufacturer: 'Alucal',
        kablan: ['Rabinovich'],
        designer: 'MTM',
        executor: ['Oleg'],
        admin: 'Michael',
        projectStatus: 'draft', // TODO: сделайте union наподобие 'draft' | 'active' | 'done'
        projectAddress: {
            city: "",
            street: "",
            house: "",
            zip: "",
            room: ""
        },
        specificationPlan: [{
            quantity: 400,
            unit: "м2",
            price: 50,
            currency: "NIS"
        }],
        specificationFact: [{
            quantity: 100,
            unit: "м2",
            price: 50,
            currency: "NIS"
        }],
    })

    const update = (path: string, value: unknown) => {
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

    const toArray = (value: string) =>
        value
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)

    const fromArray = (arr: string[]) => arr.join(', ')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        navigate('/dashboard/create')
    }


    return (
        <div className="min-h-screen w-full bg-black text-white">
            <header className="bg-gray-900 border-b border-yellow-400 py-4 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <h1 className="text-xl sm:text-2xl font-bold text-yellow-400">
                        Создать / Изменить Проект
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
                    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-yellow-400 mb-2">ID проекта</label>
                                <input
                                    type="text"
                                    value={form.id}
                                    onChange={(e) => update('id', e.target.value)}
                                    className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    placeholder="20250912oron"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-yellow-400 mb-2">Название</label>
                                <input
                                    type="text"
                                    value={form.projectName}
                                    onChange={(e) => update('projectName', e.target.value)}
                                    className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    placeholder="Oron"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-yellow-400 mb-2">Тип
                                    проекта</label>
                                <input
                                    type="text"
                                    value={form.projectKind}
                                    onChange={(e) => update('projectKind', e.target.value)}
                                    className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    placeholder="HPL"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-yellow-400 mb-2">Дата
                                    начала</label>
                                <input
                                    type="date"
                                    value={form.projectDateStart}
                                    onChange={(e) => update('projectDateStart', e.target.value)}
                                    className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-yellow-400 mb-2">Дата
                                    завершения</label>
                                <input
                                    type="date"
                                    value={form.projectDateFinish}
                                    onChange={(e) => update('projectDateFinish', e.target.value)}
                                    className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                            </div>

                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        className="block text-sm font-medium text-yellow-400 mb-2">Заказчик</label>
                                    <input
                                        type="text"
                                        value={form.customer}
                                        onChange={(e) => update('customer', e.target.value)}
                                        className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                        placeholder="Rav Barieh"
                                    />
                                </div>

                                <div>
                                    <label
                                        className="block text-sm font-medium text-yellow-400 mb-2">Производитель</label>
                                    <input
                                        type="text"
                                        value={form.manufacturer}
                                        onChange={(e) => update('manufacturer', e.target.value)}
                                        className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                        placeholder="Alucal"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-yellow-400 mb-2">
                                    Подрядчики (через запятую)
                                </label>
                                <input
                                    type="text"
                                    value={fromArray(form.kablan)}
                                    onChange={(e) => update('kablan', toArray(e.target.value))}
                                    className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    placeholder="Rabinovich, ..."
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label
                                    className="block text-sm font-medium text-yellow-400 mb-2">Проектировщик</label>
                                <input
                                    type="text"
                                    value={form.designer}
                                    onChange={(e) => update('desighner', e.target.value)}
                                    className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    placeholder="MTM"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-yellow-400 mb-2">
                                    Исполнители (через запятую)
                                </label>
                                <input
                                    type="text"
                                    value={fromArray(form.executor)}
                                    onChange={(e) => update('executor', toArray(e.target.value))}
                                    className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    placeholder="Oleg, ..."
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-yellow-400 mb-2">Админ
                                    проекта</label>
                                <input
                                    type="text"
                                    value={form.admin}
                                    onChange={(e) => update('admin', e.target.value)}
                                    className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    placeholder="Michael"
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-6 py-3 rounded-lg border-2 border-yellow-400 text-yellow-400 bg-black text-xl font-bold hover:bg-yellow-400 hover:text-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                            >
                                Сохранить
                            </button>

                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default CreateProject