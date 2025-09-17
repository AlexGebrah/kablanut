import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AuthLayout } from '../authorization/components/AuthLayout'
import {
    registerUser,
    loginWithGoogle,
    loginWithApple,
    clearError,
} from '../redux/slices/authSlice'
import type {RootState} from '../redux/types'
import type { AppDispatch } from '../redux/store'
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
        // Clear any existing errors when component mounts
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
    const handleGoogleLogin = () => {
        dispatch(loginWithGoogle())
    }
    const handleAppleLogin = () => {
        dispatch(loginWithApple())
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
                <div className="relative flex items-center justify-center w-full mt-2">
                    <div className="border-t border-gray-600 w-full"></div>
                    <span className="bg-gray-900 px-3 text-sm text-gray-400">или</span>
                    <div className="border-t border-gray-600 w-full"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="flex items-center justify-center bg-black border-2 border-yellow-400 text-white text-sm sm:text-base font-medium py-2 sm:py-3 px-4 rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Войти с Google
                    </button>
                    <button
                        type="button"
                        onClick={handleAppleLogin}
                        className="flex items-center justify-center bg-black border-2 border-yellow-400 text-white text-sm sm:text-base font-medium py-2 sm:py-3 px-4 rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M16.24 5.46c.42 0 1.04.16 1.72.47a5.57 5.57 0 0 1 1.56.99 4.63 4.63 0 0 1 1.02 1.26 3.43 3.43 0 0 1 .36 1.5c0 .42-.07.79-.24 1.17-.17.38-.4.75-.7 1.09a6.3 6.3 0 0 1-1.14.96c-.48.33-1.09.7-1.84 1.08-.57.3-1.05.69-1.44 1.15-.39.47-.58 1.05-.58 1.75 0 .42.14.8.43 1.14.29.33.76.73 1.41 1.18.48.35.94.69 1.38 1.03.44.33.83.67 1.18 1.01.34.34.6.69.79 1.04.19.34.29.71.29 1.12 0 .6-.2 1.27-.6 2 .05-.67-.08-1.36-.4-2.06a5.3 5.3 0 0 0-1.3-1.67c-.56-.49-1.24-.9-2.04-1.27-.8-.36-1.65-.68-2.53-.94L13 15.82c-.31-.12-.59-.29-.84-.52-.26-.23-.38-.56-.38-1 0-.24.06-.45.19-.62.13-.17.3-.33.51-.46.21-.13.47-.26.8-.39.32-.13.66-.26 1.01-.39.78-.28 1.39-.57 1.85-.88.45-.31.77-.63.97-.94.19-.31.32-.63.37-.94.05-.31.08-.61.08-.91 0-.32-.06-.62-.17-.9-.11-.28-.28-.53-.5-.74-.23-.21-.52-.38-.88-.51a3.89 3.89 0 0 0-1.33-.19c-.43 0-.83.04-1.18.13-.36.09-.68.22-.96.39-.28.17-.51.39-.69.65-.18.27-.29.57-.32.91-.04.81.17 1.56.66 2.25.48.69 1.21 1.27 2.21 1.75-1.42-.02-2.64-.52-3.67-1.5-1.03-.98-1.58-2.24-1.66-3.79 0-1.32.36-2.32 1.08-3 .71-.68 1.67-1.02 2.86-1.02zM12 1c.57 0 1.11.09 1.64.27.53.18 1 .44 1.42.79.42.35.76.77 1.01 1.26.26.49.38 1.05.38 1.68 0 .89-.32 1.64-.96 2.23-.64.6-1.45.89-2.43.89-.97 0-1.8-.29-2.48-.88-.68-.59-1.02-1.32-1.02-2.2 0-.33.05-.65.14-.95.09-.3.24-.58.44-.84.2-.25.45-.48.75-.67.3-.19.67-.34 1.11-.44.44-.1.93-.14 1.46-.14z"
                            />
                        </svg>
                        Войти с Apple
                    </button>
                </div>
            </form>
        </AuthLayout>
    )
}
