import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AuthLayout } from '../components/AuthLayout'
import { loginUser, clearError } from '../redux/slices/authSlice'
import type {RootState} from '../redux/types'
import type { AppDispatch } from '../redux/store'
export const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { loading, error, isAuthenticated } = useSelector(
        (state: RootState) => state.auth,
    )
    useEffect(() => {
        // Clear any existing errors when the component mounts
        dispatch(clearError())
    }, [dispatch])
    useEffect(() => {
        // Redirect if authenticated
        if (isAuthenticated) {
            navigate('/dashboard')
        }
    }, [isAuthenticated, navigate])
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        dispatch(
            loginUser({
                email,
                password,
            }),
        )
    }
    return (
        <AuthLayout
            title="Вход в систему"
            subtitle="Введите данные для входа"
            altLink={{
                text: 'Нет аккаунта? Зарегистрироваться',
                url: '/register',
                label: 'Go to registration page',
            }}
        >
            {error && (
                <div className="bg-red-900 border border-red-500 text-white px-4 py-2 rounded-md mb-4">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                    <label
                        htmlFor="email"
                        className="block text-white text-base sm:text-lg font-medium mb-1 sm:mb-2"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black border-2 border-yellow-400 rounded-lg text-white text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="your@email.com"
                        disabled={loading}
                    />
                </div>
                <div>
                    <label
                        htmlFor="password"
                        className="block text-white text-base sm:text-lg font-medium mb-1 sm:mb-2"
                    >
                        Пароль
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black border-2 border-yellow-400 rounded-lg text-white text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="••••••••"
                        disabled={loading}
                    />
                </div>
                <div className="flex items-center">
                    <input
                        id="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 sm:h-5 sm:w-5 bg-black border-2 border-yellow-400 rounded focus:ring-yellow-400 text-yellow-400"
                        disabled={loading}
                    />
                    <label
                        htmlFor="remember-me"
                        className="ml-2 block text-white text-sm sm:text-base"
                    >
                        Запомнить меня
                    </label>
                </div>
                <button
                    type="submit"
                    className="w-full bg-yellow-400 text-black text-base sm:text-lg font-bold py-2 sm:py-3 px-4 rounded-lg hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? 'Загрузка...' : 'Войти'}
                </button>
            </form>
        </AuthLayout>
    )
}