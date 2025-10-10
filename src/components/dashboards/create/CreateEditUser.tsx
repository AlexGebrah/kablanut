import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../../../redux/types.ts'
import type { UserType } from "../../typesComponents/UserType.ts"
import { searchUserById, updateUser, deleteUser, clearSearchedUser } from '../../../redux/slices/createUserSlice'
import type { AppDispatch } from '../../../redux/store'

export const CreateEditUser = () => {
    const navigate = useNavigate()
    const { user } = useSelector((state: RootState) => state.auth)
    const dispatch = useDispatch<AppDispatch>()
    const { loading, error, searchedUser, searchLoading, searchError } = useSelector(
        (state: RootState) => state.authCreateUser
    )

    const [searchId, setSearchId] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const [form, setForm] = useState<UserType>({
        id: '',
        fullName: {
            firstName: '',
            lastName: '',
        },
        birthDate: '',
        address: {
            city: '',
            street: '',
            house: '',
            room: '',
            zip: '',
        },
        contacts: {
            telephone: '',
            mail: '',
        },
        company: '',
        role: '',
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

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!searchId.trim()) {
            return
        }

        try {
            const result = await dispatch(searchUserById(searchId.trim())).unwrap()
            setForm(result)
            setIsEditing(false)
        } catch (err) {
            console.error('Search user failed', err)
        }
    }

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleCancelEdit = () => {
        if (searchedUser) {
            setForm(searchedUser)
        }
        setIsEditing(false)
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await dispatch(updateUser(form)).unwrap()
            setIsEditing(false)
            alert('Пользователь успешно обновлён')
        } catch (err) {
            console.error('Update user failed', err)
        }
    }

    const handleDelete = async () => {
        if (!searchedUser) return

        try {
            await dispatch(deleteUser(searchedUser.id)).unwrap()
            setShowDeleteConfirm(false)
            setSearchId('')
            setForm({
                id: '',
                fullName: { firstName: '', lastName: '' },
                birthDate: '',
                address: { city: '', street: '', house: '', room: '', zip: '' },
                contacts: { telephone: '', mail: '' },
                company: '',
                role: '',
            })
            alert('Пользователь успешно удалён')
        } catch (err) {
            console.error('Delete user failed', err)
        }
    }

    const handleClearSearch = () => {
        dispatch(clearSearchedUser())
        setSearchId('')
        setForm({
            id: '',
            fullName: { firstName: '', lastName: '' },
            birthDate: '',
            address: { city: '', street: '', house: '', room: '', zip: '' },
            contacts: { telephone: '', mail: '' },
            company: '',
            role: '',
        })
        setIsEditing(false)
    }

    return (
        <div className="min-h-screen w-full bg-black text-white">
            <header className="bg-gray-900 border-b border-yellow-400 py-4 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <h1 className="text-xl sm:text-2xl font-bold text-yellow-400">
                        Редактировать / Удалить Пользователя
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
                    {/* Search Section */}
                    <div className="mb-8 pb-8 border-b border-yellow-400">
                        <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
                            <label className="block text-sm font-medium text-yellow-400 mb-2">
                                Поиск пользователя по ID
                            </label>
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={searchId}
                                    onChange={(e) => setSearchId(e.target.value)}
                                    className="flex-1 bg-black text-white border-2 border-yellow-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    placeholder="Введите ID пользователя"
                                    disabled={searchLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={searchLoading || !searchId.trim()}
                                    className="px-6 py-3 rounded-lg border-2 border-yellow-400 text-lg font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 bg-black text-yellow-400 hover:bg-yellow-400 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {searchLoading ? 'Поиск...' : 'Найти'}
                                </button>
                                {searchedUser && (
                                    <button
                                        type="button"
                                        onClick={handleClearSearch}
                                        className="px-6 py-3 rounded-lg border-2 border-red-500 text-lg font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 bg-black text-red-500 hover:bg-red-500 hover:text-black"
                                    >
                                        Очистить
                                    </button>
                                )}
                            </div>
                            {searchError && (
                                <div className="mt-3 text-red-400 text-center">
                                    {searchError}
                                </div>
                            )}
                        </form>
                    </div>

                    {/* User Form Section */}
                    {searchedUser && (
                        <form onSubmit={handleUpdate} className="w-full max-w-3xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-yellow-400 mb-2">ID</label>
                                    <input
                                        type="text"
                                        value={form.id}
                                        className="w-full bg-gray-800 text-gray-500 border-2 border-gray-600 rounded-lg px-4 py-3 cursor-not-allowed"
                                        disabled
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-yellow-400 mb-2">Имя</label>
                                    <input
                                        type="text"
                                        value={form.fullName.firstName}
                                        onChange={(e) => update('fullName.firstName', e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                                            isEditing
                                                ? 'bg-black text-white border-yellow-400'
                                                : 'bg-gray-800 text-gray-300 border-gray-600 cursor-not-allowed'
                                        }`}
                                        placeholder="Michael"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-yellow-400 mb-2">Фамилия</label>
                                    <input
                                        type="text"
                                        value={form.fullName.lastName}
                                        onChange={(e) => update('fullName.lastName', e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                                            isEditing
                                                ? 'bg-black text-white border-yellow-400'
                                                : 'bg-gray-800 text-gray-300 border-gray-600 cursor-not-allowed'
                                        }`}
                                        placeholder="Ivanov"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-yellow-400 mb-2">Дата рождения</label>
                                    <input
                                        type="date"
                                        value={form.birthDate}
                                        onChange={(e) => update('birthDate', e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                                            isEditing
                                                ? 'bg-black text-white border-yellow-400'
                                                : 'bg-gray-800 text-gray-300 border-gray-600 cursor-not-allowed'
                                        }`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-yellow-400 mb-2">Город</label>
                                    <input
                                        type="text"
                                        value={form.address.city}
                                        onChange={(e) => update('address.city', e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                                            isEditing
                                                ? 'bg-black text-white border-yellow-400'
                                                : 'bg-gray-800 text-gray-300 border-gray-600 cursor-not-allowed'
                                        }`}
                                        placeholder="Lod"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-yellow-400 mb-2">Улица</label>
                                    <input
                                        type="text"
                                        value={form.address.street}
                                        onChange={(e) => update('address.street', e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                                            isEditing
                                                ? 'bg-black text-white border-yellow-400'
                                                : 'bg-gray-800 text-gray-300 border-gray-600 cursor-not-allowed'
                                        }`}
                                        placeholder="Bar Kohva"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-yellow-400 mb-2">Дом</label>
                                    <input
                                        type="text"
                                        value={form.address.house}
                                        onChange={(e) => update('address.house', e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                                            isEditing
                                                ? 'bg-black text-white border-yellow-400'
                                                : 'bg-gray-800 text-gray-300 border-gray-600 cursor-not-allowed'
                                        }`}
                                        placeholder="12"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-yellow-400 mb-2">Квартира</label>
                                    <input
                                        type="text"
                                        value={form.address.room}
                                        onChange={(e) => update('address.room', e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                                            isEditing
                                                ? 'bg-black text-white border-yellow-400'
                                                : 'bg-gray-800 text-gray-300 border-gray-600 cursor-not-allowed'
                                        }`}
                                        placeholder="1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-yellow-400 mb-2">Индекс</label>
                                    <input
                                        type="text"
                                        value={form.address.zip}
                                        onChange={(e) => update('address.zip', e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                                            isEditing
                                                ? 'bg-black text-white border-yellow-400'
                                                : 'bg-gray-800 text-gray-300 border-gray-600 cursor-not-allowed'
                                        }`}
                                        placeholder="123456"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-yellow-400 mb-2">Телефон</label>
                                    <input
                                        type="tel"
                                        value={form.contacts.telephone}
                                        onChange={(e) => update('contacts.telephone', e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                                            isEditing
                                                ? 'bg-black text-white border-yellow-400'
                                                : 'bg-gray-800 text-gray-300 border-gray-600 cursor-not-allowed'
                                        }`}
                                        placeholder="+972531112233"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-yellow-400 mb-2">E-mail</label>
                                    <input
                                        type="email"
                                        value={form.contacts.mail}
                                        onChange={(e) => update('contacts.mail', e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                                            isEditing
                                                ? 'bg-black text-white border-yellow-400'
                                                : 'bg-gray-800 text-gray-300 border-gray-600 cursor-not-allowed'
                                        }`}
                                        placeholder="michael@gmail.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-yellow-400 mb-2">Компания</label>
                                    <input
                                        type="text"
                                        value={form.company}
                                        onChange={(e) => update('company', e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                                            isEditing
                                                ? 'bg-black text-white border-yellow-400'
                                                : 'bg-gray-800 text-gray-300 border-gray-600 cursor-not-allowed'
                                        }`}
                                        placeholder="IBM"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-yellow-400 mb-2">Роль</label>
                                    <input
                                        type="text"
                                        value={form.role}
                                        onChange={(e) => update('role', e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                                            isEditing
                                                ? 'bg-black text-white border-yellow-400'
                                                : 'bg-gray-800 text-gray-300 border-gray-600 cursor-not-allowed'
                                        }`}
                                        placeholder="constructor"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                {!isEditing ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleEdit}
                                            className="w-full sm:w-auto px-6 py-3 rounded-lg border-2 border-yellow-400 text-xl font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 bg-black text-yellow-400 hover:bg-yellow-400 hover:text-black"
                                        >
                                            Редактировать
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowDeleteConfirm(true)}
                                            className="w-full sm:w-auto px-6 py-3 rounded-lg border-2 border-red-500 text-xl font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 bg-black text-red-500 hover:bg-red-500 hover:text-black"
                                        >
                                            Удалить
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`w-full sm:w-auto px-6 py-3 rounded-lg border-2 border-green-500 text-xl font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
                                                loading
                                                    ? 'opacity-60 cursor-not-allowed bg-black text-green-500'
                                                    : 'bg-black text-green-500 hover:bg-green-500 hover:text-black'
                                            }`}
                                        >
                                            {loading ? 'Сохранение...' : 'Сохранить изменения'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            disabled={loading}
                                            className="w-full sm:w-auto px-6 py-3 rounded-lg border-2 border-gray-500 text-xl font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 bg-black text-gray-500 hover:bg-gray-500 hover:text-black disabled:opacity-50"
                                        >
                                            Отмена
                                        </button>
                                    </>
                                )}
                            </div>

                            {error && (
                                <div className="mt-4 text-red-400 text-center">
                                    {error}
                                </div>
                            )}
                        </form>
                    )}

                    {/* Delete Confirmation Modal */}
                    {showDeleteConfirm && (
                        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-4">
                            <div className="bg-gray-900 border-2 border-red-500 rounded-lg p-6 max-w-md w-full">
                                <h2 className="text-2xl font-bold text-red-500 mb-4">Подтверждение удаления</h2>
                                <p className="text-white mb-6">
                                    Вы уверены, что хотите удалить пользователя{' '}
                                    <span className="text-yellow-400 font-bold">
                                        {form.fullName.firstName} {form.fullName.lastName}
                                    </span>
                                    ?
                                </p>
                                <p className="text-gray-400 text-sm mb-6">
                                    Это действие необратимо!
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleDelete}
                                        disabled={loading}
                                        className="flex-1 px-4 py-3 rounded-lg border-2 border-red-500 text-lg font-bold bg-black text-red-500 hover:bg-red-500 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Удаление...' : 'Да, удалить'}
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        disabled={loading}
                                        className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-500 text-lg font-bold bg-black text-gray-500 hover:bg-gray-500 hover:text-black transition-colors disabled:opacity-50"
                                    >
                                        Отмена
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!searchedUser && !searchLoading && (
                        <div className="text-center text-gray-400 py-12">
                            <p className="text-xl">Введите ID пользователя для поиска</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default CreateEditUser