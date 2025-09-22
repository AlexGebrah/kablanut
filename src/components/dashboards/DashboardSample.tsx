
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../redux/slices/authSlice.ts'
import type {RootState} from '../../redux/types.ts'
export const DashboardSample = () => {
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
                            className="bg-yellow-400 text-black px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-sm sm:text-base font-medium hover:bg-yellow-300"
                        >
                            Выйти
                        </button>
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-gray-900 border-2 border-yellow-400 rounded-lg p-4 sm:p-6 md:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-yellow-400">
                        Добро пожаловать!
                    </h2>
                    <p className="text-white mb-4">
                        Вы успешно вошли в систему с высоким контрастом, оптимизированную
                        для яркого солнечного света.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="bg-black border border-yellow-400 rounded-lg p-4 hover:border-yellow-300 transition-colors"
                            >
                                <h3 className="text-lg font-medium text-yellow-400 mb-2">
                                    Секция {item}
                                </h3>
                                <p className="text-gray-300 text-sm">
                                    Пример контента с высоким контрастом для легкой видимости на
                                    ярком солнце.
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}