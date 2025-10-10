import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Provider} from 'react-redux'
import {store} from './redux/store'
import Login from './components/authorization/Login.tsx'
import Register from './components/authorization/Register.tsx'
import DashboardCustomer from './components/dashboards/DashboardCustomer.tsx'
import CreateUserProject from "./components/dashboards/create/CreateUserProject.tsx";
import CreateUser from "./components/dashboards/create/CreateUser.tsx";
import CreateProject from "./components/dashboards/create/CreateProject.tsx";
import ProjectPlanFact from "./components/dashboards/project/ProjectPlanFact.tsx";
import Materials from "./components/dashboards/materials/MaterialsRequest.tsx";
import ProblemsRequest from "./components/dashboards/problems/ProblemsRequest.tsx";
import Reports from "./components/dashboards/reports/Reports.tsx";
import ReportLastMonth from "./components/dashboards/reports/ReportLastMonth.tsx";
import MaterialsRequestCreate from "./components/dashboards/materials/MaterialsRequestCreate.tsx";
import ProblemsRequestCreate from "./components/dashboards/problems/ProblemsRequestCreate.tsx";
import ProjectPlanCreate from "./components/dashboards/project/ProjectPlanCreate.tsx";
import ProjectFactCreate from "./components/dashboards/project/ProjectFactCreate.tsx";
import MaterialsActive from "./components/dashboards/materials/MaterialsActive.tsx";
import ProblemsActive from "./components/dashboards/problems/ProblemsActive.tsx";


export function App() {


    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/dashboard" element={<DashboardCustomer/>}/>
                    <Route path="/dashboard/create" element={<CreateUserProject/>}/>
                    <Route path="/dashboard/create/user" element={<CreateUser/>}/>
                    <Route path="/dashboard/create/project" element={<CreateProject/>}/>
                    <Route path="/dashboard/project" element={<ProjectPlanFact/>}/>
                    <Route path="/dashboard/project/plan" element={<ProjectPlanCreate/>}/>
                    <Route path="/dashboard/project/fact" element={<ProjectFactCreate/>}/>
                    <Route path="/dashboard/materials" element={<Materials/>}/>
                    <Route path="/dashboard/materials/request" element={<MaterialsRequestCreate/>}/>
                    <Route path="/dashboard/materials/active" element={<MaterialsActive/>}/>
                    <Route path="/dashboard/alarm" element={<ProblemsRequest/>}/>
                    <Route path="/dashboard/alarm/request" element={<ProblemsRequestCreate/>}/>
                    <Route path="/dashboard/alarm/active" element={<ProblemsActive/>}/>                    <Route path="/dashboard/report" element={<Reports/>}/>
                    <Route path="/dashboard/report/last" element={<ReportLastMonth/>}/>

                </Routes>
            </BrowserRouter>
        </Provider>
    )
}