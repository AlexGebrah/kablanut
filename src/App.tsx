import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { Login } from './components/authorization/Login.tsx'
import { Register } from './components/authorization/Register.tsx'
import { DashboardCustomer } from './components/dashboards/DashboardCustomer.tsx'
import CreateUserProject from "./components/dashboards/create/CreateUserProject.tsx";
import CreateUser from "./components/dashboards/create/CreateUser.tsx";
import CreateProject from "./components/dashboards/create/CreateProject.tsx";
import ProjectPlanFact from "./components/dashboards/project/ProjectPlanFact.tsx";
import Materials from "./components/dashboards/materials/MaterialsRequest.tsx";
import ProblemsRequest from "./components/dashboards/problems/ProblemsRequest.tsx";
import Reports from "./components/dashboards/reports/Reports.tsx";
import ReportLastMonth from "./components/dashboards/reports/ReportLastMonth.tsx";
import MaterialsRequestCreate from "./components/dashboards/materials/MaterialsRequestCreate.tsx";
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
                    <Route path="/dashboard/create/user" element={<CreateUser />} />
                    <Route path="/dashboard/create/project" element={<CreateProject />} />
                    <Route path="/dashboard/project" element={<ProjectPlanFact />} />
                    <Route path="/dashboard/materials" element={<Materials />} />
                    <Route path="/dashboard/alarm" element={<ProblemsRequest />} />
                    <Route path="/dashboard/report" element={<Reports />} />
                    <Route path="/dashboard/report/last" element={<ReportLastMonth />} />
                    <Route path="/dashboard/materials/request" element={<MaterialsRequestCreate />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    )
}