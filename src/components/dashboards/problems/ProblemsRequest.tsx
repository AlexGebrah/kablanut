import { useNavigate } from 'react-router-dom'
import {useSelector } from 'react-redux'
import type { RootState } from '../../../redux/types.ts'

export const ProblemsRequest = () => {
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
                                <button
                                    type="button"
                                    aria-label="Заявить о проблеме"
                                    onClick={() => navigate('/dashboard/alarm/request')}
                                    className="w-full py-3.5 sm:py-4 rounded-lg border-2 border-yellow-400 text-yellow-400 bg-black text-2xl font-bold whitespace-nowrap
                           hover:bg-yellow-400 hover:text-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                                >
                                    Заявить о проблеме
                                </button>

                                <button
                                    type="button"
                                    aria-label="Заявки в обработке"
                                    onClick={() => navigate('/dashboard/alarm/active')}
                                    className="w-full py-3.5 sm:py-4 rounded-lg border-2 border-yellow-400 text-yellow-400 bg-black text-2xl font-bold whitespace-nowrap
                           hover:bg-yellow-400 hover:text-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                                >
                                    Заявки в обработке
                                </button>
                            </div>


                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ProblemsRequest
