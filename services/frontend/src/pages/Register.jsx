import RegisterFrom from "../components/RegisterFrom.jsx";
import {useNavigate} from 'react-router-dom'
export default function Register() {
    const navigation = useNavigate()
    return (
        <div className={'min-h-screen flex items-center justify-center px-4 bg-gray-100'}>
            <div className='w-full max-w-md bg-white m-6 rounded shadow'>
            <h1 className={' text-2l font-bold text-center mb-4'}>Register</h1>
            <RegisterFrom/>
                <button onClick={navigation('/login')} className='text-center'>masz konto? zaloguj sie</button>
            </div>
        </div>
    )
}