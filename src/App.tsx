import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { Login } from './components/authorization/Login.tsx'
import { Register } from './components/authorization/Register.tsx'
import { DashboardCustomer } from './components/dashboards/DashboardCustomer.tsx'
import CreateUserProject from "./components/dashboards/create/CreateUserProject.tsx";
import CreateUser from "./components/dashboards/create/CreateUser.tsx";
export function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<DashboardCustomer />} />
                    <Route path="/dashboard/create" element={<CreateUserProject />} />
                    <Route path="dashboard/create/user" element={<CreateUser />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    )
}