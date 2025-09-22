import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { Login } from './components/authorization/Login.tsx'
import { Register } from './components/authorization/Register.tsx'
import { DashboardCustomer } from './components/dashboards/DashboardCustomer.tsx'
export function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<DashboardCustomer />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    )
}