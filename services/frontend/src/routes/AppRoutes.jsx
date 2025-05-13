import {Navigate, Route, Routes} from "react-router-dom";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Dashboard from "../pages/Admin/Dashboard.jsx";
import Users from "../pages/Admin/Users.jsx";
import Orders from "../pages/Admin/Orders.jsx";

export default function AppRoutes(){
    return (
        <Routes>
            <Route path='/' element={<Navigate to='/login' />} />
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/admin' element={<Dashboard/>}/>
            <Route path='/admin/users' element={<Users />}/>
            <Route path='/admin/orders' element={<Orders/>}/>
            <Route path='*' element={<div>404</div>}/>
        </Routes>
    )
}