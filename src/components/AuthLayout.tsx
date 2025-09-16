import React from 'react'
import { Link } from 'react-router-dom'
interface AuthLayoutProps {
    children: React.ReactNode
    title: string
    subtitle: string
    altLink: {
        text: string
        url: string
        label: string
    }
}
export const AuthLayout: React.FC<AuthLayoutProps> = ({
                                                          children,
                                                          title,
                                                          subtitle,
                                                          altLink,
                                                      }) => {
    return (
        <div className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-900 border-2 border-yellow-400 rounded-lg p-4 sm:p-6 md:p-8 shadow-lg mx-auto">
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-1 sm:mb-2">
                        {title}
                    </h1>
                    <p className="text-white text-base sm:text-lg">{subtitle}</p>
                </div>
                {children}
                <div className="mt-4 sm:mt-6 text-center">
                    <Link
                        to={altLink.url}
                        className="text-yellow-400 text-base sm:text-lg font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1"
                    >
                        {altLink.text}
                    </Link>
                </div>
            </div>
        </div>
    )
}
