import { useNavigate } from 'react-router-dom'
import {useSelector } from 'react-redux'
import type { RootState } from '../../../redux/types.ts'

export const ReportLastMonth = () => {
    const navigate = useNavigate()
    const { user } = useSelector((state: RootState) => state.auth)

    const handleLogout = () => {
        navigate('/dashboard')
    }

    return (
        <div className="min-h-screen w-full bg-black text-white">
            <header className="bg-gray-900 border-b border-yellow-400 py-4 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <h1 className="text-xl sm:text-2xl font-bold text-yellow-400">
                        Создать
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
                    <div className="w-full max-w-md mx-auto">
                        <div className="flex flex-col gap-9 sm:gap-12">
                            <div className="flex flex-col gap-9 sm:gap-12">
                                <div className="text-2xl font-bold text-yellow-400 border-b-2 border-yellow-400 pb-3"
                                >
                                    Отчет за последний месяц
                                </div>

                                // Заглушка
                                {/* Заголовки таблицы */}
                                <div className="grid grid-cols-[60px_1fr_120px_100px] font-bold text-yellow-400 border-b-2 border-yellow-400 pb-2">
                                    <span className="text-left">ID</span>
                                    <span className="text-left">Наименование</span>
                                    <span className="text-right">Сумма</span>
                                    <span className="text-right">Ед. изм.</span>
                                </div>

                                {/* Проект 1 */}
                                <div className="grid grid-cols-[60px_1fr_120px_100px] items-center py-2 border-b border-yellow-400 text-white">
                                    <span className="text-left">1</span>
                                    <span className="text-left">Проект А</span>
                                    <span className="text-right">12000</span>
                                    <span className="text-right">руб.</span>
                                </div>

                                {/* Проект 2 */}
                                <div className="grid grid-cols-[60px_1fr_120px_100px] items-center py-2 border-b border-yellow-400 text-white">
                                    <span className="text-left">2</span>
                                    <span className="text-left">Проект B</span>
                                    <span className="text-right">8500</span>
                                    <span className="text-right">руб.</span>
                                </div>

                                {/* Проект 3 */}
                                <div className="grid grid-cols-[60px_1fr_120px_100px] items-center py-2 border-b border-yellow-400 text-white">
                                    <span className="text-left">3</span>
                                    <span className="text-left">Проект C</span>
                                    <span className="text-right">6400</span>
                                    <span className="text-right">руб.</span>
                                </div>

                                {/* Итого */}
                                <div className="grid grid-cols-[60px_1fr_120px_100px] font-bold text-yellow-400 pt-4">
                                    <span className="col-span-2 text-left">ИТОГО</span>
                                    <span className="text-right">26900</span>
                                    <span className="text-right">руб.</span>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ReportLastMonth
