import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../redux/slices/authSlice.ts'
import type {RootState} from '../../redux/types.ts'

export const DashboardCustomer = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector((state: RootState) => state.auth)
    const handleLogout = () => {
        dispatch(logout())
        navigate('/login')
    }
    return (
        <div className="min-h-screen w-full bg-black text-white">
            <header className="bg-gray-900 border-b border-yellow-400 py-4 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <h1 className="text-xl sm:text-2xl font-bold text-yellow-400">
                        Панель управления
                    </h1>
                    <div className="flex items-center space-x-4">
            <span className="hidden sm:inline text-white">
              Привет, {user?.name || 'Пользователь'}
            </span>
                        <button
                            onClick={handleLogout}
                            className="bg-yellow-400 text-black px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-[1.3125rem] sm:text-2xl font-medium hover:bg-yellow-300"
                        >
                            Выйти
                        </button>
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-gray-900 border-2 border-yellow-400 rounded-lg p-4 sm:p-6 md:p-8">
                    {/* Кнопки: одна под другой */}
                    <div className="w-full max-w-md mx-auto">
                        <div className="flex flex-col gap-3 sm:gap-4">
                            <button
                                type="button"
                                aria-label="Создать"
                                onClick={() => navigate('/dashboard/create')}
                                className="w-full py-3.5 sm:py-4 rounded-lg border-2 border-yellow-400 text-yellow-400 bg-black text-2xl sm:text-[1.6875rem] font-bold
                                           hover:bg-yellow-400 hover:text-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                            >
                                Создать
                            </button>
                            <button
                                type="button"
                                aria-label="Проекты"
                                onClick={() => navigate('/dashboard/project')}
                                className="w-full py-3.5 sm:py-4 rounded-lg border-2 border-yellow-400 text-yellow-400 bg-black text-2xl sm:text-[1.6875rem] font-bold
                                           hover:bg-yellow-400 hover:text-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                            >
                                Проект
                            </button>
                            <button
                                type="button"
                                aria-label="Отчеты"
                                onClick={() => navigate('/dashboard/report')}
                                className="w-full py-3.5 sm:py-4 rounded-lg border-2 border-yellow-400 text-yellow-400 bg-black text-2xl sm:text-[1.6875rem] font-bold
                                           hover:bg-yellow-400 hover:text-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                            >
                                Отчет
                            </button>
                            <button
                                type="button"
                                aria-label="Материалы"
                                onClick={() => navigate('/dashboard/materials')}
                                className="w-full py-3.5 sm:py-4 rounded-lg border-2 border-yellow-400 text-yellow-400 bg-black text-2xl sm:text-[1.6875rem] font-bold
                                           hover:bg-yellow-400 hover:text-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                            >
                                Материалы
                            </button>
                            <button
                                type="button"
                                aria-label="Тревога"
                                onClick={() => navigate('/dashboard/alarm')}
                                className="w-full py-3.5 sm:py-4 rounded-lg border-2 border-yellow-400 text-yellow-400 bg-black text-2xl sm:text-[1.6875rem] font-bold
                                           hover:bg-yellow-400 hover:text-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                            >
                                Проблемы
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
