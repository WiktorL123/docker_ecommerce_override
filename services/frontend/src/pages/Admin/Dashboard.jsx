import {useEffect, useState} from 'react'
import {useNavigate } from 'react-router-dom'
export default function Dashboard() {

    const [email, setEmail] = useState('')
    const [token, setToken] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        setToken(localStorage.getItem('token') ?? '')
        setEmail(localStorage.getItem('email') ?? '')
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('email')
        navigate('/login')

    }
    return (

        <>
            <h1>Dashboard PAGE - {email ? email : 'not logged in'} </h1>
            <button onClick={handleLogout}>{token ? 'wyloguj' : 'zaloguj sie'}</button>
        </>
    )
}