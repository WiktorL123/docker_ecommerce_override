import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import {useNavigate} from 'react-router-dom'

const schema = Yup.object().shape({
    email: Yup.string().required('Email is required').min(3, 'min 3 length').max(20, 'max 20 length'),
    password: Yup.string().required('Password is required').min(3, 'min 3 length').max(20, 'max 20 length'),
})

export default function LoginForm(){
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    const navigate = useNavigate()
    const {
       register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {email: '', password: ''},
        resolver: yupResolver(schema),
        mode: 'all'
    })

    const handleSubmitLogin = async (formData) => {
       try {
           const res = await fetch('/api/auth/login', {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json',
               },
               body: JSON.stringify(formData),

           })
           if (!res.ok) {
               const err = await res.json()
               throw new Error(err.message)
           }
           const data = await res.json()
           const {token, email}  = data
           localStorage.setItem('token', token)
           localStorage.setItem('email', email)
           setSuccessMessage('Logged in successfully, redirecting...')
           setTimeout(()=>navigate('/admin'), 3000)

       }
       catch (error){
           setError(error.message)
       }
       finally {
           setLoading(false)
       }

    }
    return (
        <form
            onSubmit={handleSubmit(handleSubmitLogin)}
            className="flex flex-col gap-4 p-4 max-w-md mx-auto bg-white rounded shadow"
        >
            <h2 className="text-xl font-bold">Login</h2>

            <input
                type={'email'}
                {...register('email')}
                placeholder="Email"
                className="border p-2"/>
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}

            <input
                type="password"
                {...register('password')}
                placeholder="Password"
                className="border p-2"
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}

            <button type="submit" className="bg-green-500 text-white p-2 rounded" disabled={loading}>
                {loading ? `${successMessage}` : 'Login'}
            </button>

            {error && <p className="text-red-500"> {error}</p>}
            {successMessage && <p className="text-green-600"> {successMessage}</p>}
        </form>
    )
}