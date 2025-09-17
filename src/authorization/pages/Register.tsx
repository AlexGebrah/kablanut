import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AuthLayout } from '../components/AuthLayout.tsx'
import { registerUser, clearError } from '../../redux/slices/authSlice.ts'
import type {RootState} from '../../redux/types.ts'
import type { AppDispatch } from '../../redux/store.ts'
export const Register = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [agreeToTerms, setAgreeToTerms] = useState(false)
    const [passwordError, setPasswordError] = useState('')
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
    const validatePasswords = (): boolean => {
        if (password !== confirmPassword) {
            setPasswordError('Пароли не совпадают')
            return false
        }
        if (password.length < 6) {
            setPasswordError('Пароль должен содержать минимум 6 символов')
            return false
        }
        setPasswordError('')
        return true
    }
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!validatePasswords()) {
            return
        }
        dispatch(
            registerUser({
                name,
                email,
                password,
            }),
        )
    }
    return (
        <AuthLayout
            title="Регистрация"
            subtitle="Создайте новый аккаунт"
            altLink={{
                text: 'Уже есть аккаунт? Войти',
                url: '/login',
                label: 'Go to login page',
            }}
        >
            {(error || passwordError) && (
                <div className="bg-red-900 border border-red-500 text-white px-4 py-2 rounded-md mb-4">
                    {error || passwordError}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5">
                <div>
                    <label
                        htmlFor="name"
                        className="block text-white text-base sm:text-lg font-medium mb-1 sm:mb-2"
                    >
                        Имя
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black border-2 border-yellow-400 rounded-lg text-white text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Иван Иванов"
                        disabled={loading}
                    />
                </div>
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
                        onChange={(e) => {
                            setPassword(e.target.value)
                            if (confirmPassword) validatePasswords()
                        }}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black border-2 border-yellow-400 rounded-lg text-white text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="••••••••"
                        disabled={loading}
                    />
                </div>
                <div>
                    <label
                        htmlFor="confirm-password"
                        className="block text-white text-base sm:text-lg font-medium mb-1 sm:mb-2"
                    >
                        Подтвердите пароль
                    </label>
                    <input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value)
                            if (password) validatePasswords()
                        }}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black border-2 border-yellow-400 rounded-lg text-white text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="••••••••"
                        disabled={loading}
                    />
                </div>
                <div className="flex items-center">
                    <input
                        id="agree-terms"
                        type="checkbox"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        required
                        className="h-4 w-4 sm:h-5 sm:w-5 bg-black border-2 border-yellow-400 rounded focus:ring-yellow-400 text-yellow-400"
                        disabled={loading}
                    />
                    <label
                        htmlFor="agree-terms"
                        className="ml-2 block text-white text-sm sm:text-base"
                    >
                        Я согласен с правилами и условиями
                    </label>
                </div>
                <button
                    type="submit"
                    className="w-full bg-yellow-400 text-black text-base sm:text-lg font-bold py-2 sm:py-3 px-4 rounded-lg hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? 'Загрузка...' : 'Зарегистрироваться'}
                </button>
            </form>
        </AuthLayout>
    )
}