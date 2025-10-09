import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../../../redux/types.ts'
import type {UserType} from "../../typesComponents/UserType.ts";
import { createUser } from '../../../redux/slices/authCreateUser'
import type { AppDispatch } from '../../../redux/store'


export const CreateUser = () => {
    const navigate = useNavigate()
    const { user } = useSelector((state: RootState) => state.auth)
    const dispatch = useDispatch<AppDispatch>()
    const { loading, error} = useSelector((state: RootState) => state.authCreateUser)

    const [form, setForm] = useState<UserType>({
        id: '100200300',
        fullName: {
            firstName: 'Michael',
            lastName: 'Ivanov',
        },
        birthDate: '2000-09-11',
        address: {
            city: "Lod",
            street: "Gerzl",
            house: "12",
            room: "1",
            zip: "123456",
        },
        contacts: {
            telephone: '+972531112233',
            mail: 'michael@gmail.com',
        },
        company: 'IBM',
        role: 'constructor',
    })

    const update = (path: string, value: string | number | '') => {
        setForm(prev => {
            const next: any = { ...prev }
            const parts = path.split('.')
            let cursor = next
            for (let i = 0; i < parts.length - 1; i++) {
                const key = parts[i]
                cursor[key] = Array.isArray(cursor[key]) ? [...cursor[key]] : { ...cursor[key] }
                cursor = cursor[key]
            }
            cursor[parts[parts.length - 1]] = value
            return next
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await dispatch(createUser(form)).unwrap()
            navigate('/dashboard/create')
        } catch (err) {
            // error is handled via redux state
            console.error('Create user failed', err)
        }
    }


    return (
        <div className="min-h-screen w-full bg-black text-white">
            <header className="bg-gray-900 border-b border-yellow-400 py-4 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <h1 className="text-xl sm:text-2xl font-bold text-yellow-400">
                        Создать / Изменить Пользователя
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
                                <label className="block text-sm font-medium text-yellow-400 mb-2">ID</label>
                                <input
                                    type="text"
                                    value={form.id}
                                    onChange={(e) => update('id', e.target.value)}
                                    className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    placeholder="ID пользователя"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-yellow-400 mb-2">Имя</label>
                                <input
                                    type="text"
                                    value={form.fullName.firstName}
                                    onChange={(e) => update('fullName.firstName', e.target.value)}
                                    className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    placeholder="Michael"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-yellow-400 mb-2">Фамилия</label>
                                <input
                                    type="text"
                                    value={form.fullName.lastName}
                                    onChange={(e) => update('fullName.lastName', e.target.value)}
                                    className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    placeholder="Ivanov"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-yellow-400 mb-2">Дата рождения</label>
                                <input
                                    type="date"
                                    value={form.birthDate}
                                    onChange={(e) => update('birthDate', e.target.value)}
                                    className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-yellow-400 mb-2">Город</label>
                                <input
                                    type="text"
                                    value={form.address.city}
                                    onChange={(e) => update('address.city', e.target.value)}
                                    className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    placeholder="Lod"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-yellow-400 mb-2">Улица</label>
                                <input
                                    type="text"
                                    value={form.address.street}
                                    onChange={(e) => update('address.street', e.target.value)}
                                    className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    placeholder="Bar Kohva"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-yellow-400 mb-2">Дом</label>
                                <input
                                    type="string"
                                    value={form.address.house}
                                    onChange={(e) => update('address.house', e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    placeholder="12"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-yellow-400 mb-2">Дом</label>
                                <input
                                    type="string"
                                    value={form.address.room}
                                    onChange={(e) => update('address.room', e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    placeholder="1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-yellow-400 mb-2">Дом</label>
                                <input
                                    type="string"
                                    value={form.address.zip}
                                    onChange={(e) => update('address.zip', e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    placeholder="123456"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-yellow-400 mb-2">Телефон</label>
                                <input
                                    type="tel"
                                    value={form.contacts.telephone}
                                    onChange={(e) => update('contacts.telephone', e.target.value)}
                                    className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    placeholder="+972531112233"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-yellow-400 mb-2">E-mail</label>
                                <input
                                    type="email"
                                    value={form.contacts.mail}
                                    onChange={(e) => update('contacts.mail', e.target.value)}
                                    className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    placeholder="michael@gmail.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-yellow-400 mb-2">Компания</label>
                                <input
                                    type="text"
                                    value={form.company}
                                    onChange={(e) => update('company', e.target.value)}
                                    className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    placeholder="IBM"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-yellow-400 mb-2">Роль</label>
                                <input
                                    type="text"
                                    value={form.role}
                                    onChange={(e) => update('role', e.target.value)}
                                    className="w-full bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    placeholder="constructor"
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full sm:w-auto px-6 py-3 rounded-lg border-2 border-yellow-400 text-xl font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${loading ? 'opacity-60 cursor-not-allowed bg-black text-yellow-400' : 'bg-black text-yellow-400 hover:bg-yellow-400 hover:text-black'}`}
                            >
                                {loading ? 'Сохранение...' : 'Сохранить'}
                            </button>
                            {error && (
                                <div className="text-red-400 mt-3">
                                    {error}
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default CreateUser

