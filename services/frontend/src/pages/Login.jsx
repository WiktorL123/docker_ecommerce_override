import LoginForm from "../components/LoginForm.jsx";
import {useNavigate } from 'react-router-dom'


export default function Login() {
    const navigation = useNavigate()
    return (
        <div className='min-h-screen flex items-center justify-center px-4 bg-gray-100'>
            <div className='w-full max-w-md bg-white m-6 rounded shadow'>
                <h1 className=' text-2l font-bold text-center mb-4'>LOGIN PAGE</h1>
                <LoginForm/>
                <button onClick={navigation('/register')} className='text-center'>nie masz konta? zarejestruj sie</button>
            </div>
        </div>
    )
}