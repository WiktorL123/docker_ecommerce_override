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

    const sites = [{id:1, name: 'orders'}, {id:2, name: 'users'}]

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('email')
        navigate('/login')

    }
    return (
<>
        <div className="flex justify-between items-center mx-6 py-4">
            <h1 className="text-lg font-semibold">
                Dashboard PAGE - {email ? email : 'not logged in'}
            </h1>

            <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                onClick={handleLogout}
            >
                {token ? 'Wyloguj się' : 'Zaloguj się'}
            </button>


        </div>
    <div className="flex justify-center w-full">
        <div className="flex flex-wrap justify-center gap-6 w-full max-w-4xl p-4">
            {sites.map((site) => (
                <div
                    key={site.id}
                    onClick={() => navigate(`/admin/${site.name}`)}
                    className="cursor-pointer border border-gray-300 rounded p-6 text-center shadow hover:shadow-md transition bg-white"
                >
                    <p className="text-lg font-medium capitalize">{site.name}</p>
                </div>
            ))}
        </div>
    </div>

</>
    )
}