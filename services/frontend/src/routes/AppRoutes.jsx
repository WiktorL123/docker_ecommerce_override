import {Navigate, Route, Routes} from "react-router-dom";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Dashboard from "../pages/Admin/Dashboard.jsx";
import Users from "../pages/Admin/Users.jsx";
import Orders from "../pages/Admin/Orders.jsx";
import PrivateRoute from "../components/PrivateRoute.jsx";

export default function AppRoutes(){
    return (
        <Routes>
            <Route path='/' element={<Navigate to='/login' />} />
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/admin' element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
            <Route path='/admin/users' element={<PrivateRoute><Users /></PrivateRoute>}/>
            <Route path='/admin/orders' element={<PrivateRoute><Orders/></PrivateRoute>}/>
            <Route path='*' element={<div>404</div>}/>
        </Routes>
    )
}