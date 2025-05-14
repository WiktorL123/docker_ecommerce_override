import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'

const schema = Yup.object().shape({
    email: Yup.string().required('Email is required').min(3, 'min 3 length').max(20, 'max 20 length'),
    password: Yup.string().required('Password is required').min(3, 'min 3 length').max(20, 'max 20 length'),
})

export default function RegisterForm() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [successMessage, setSuccessMessage] = useState('')

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: { email: '', password: '' },
        resolver: yupResolver(schema),
        mode: 'onBlur'
    })

    const handleSubmitRegister = async (formData) => {
        setLoading(true)
        setError(null)
        setSuccessMessage('')
        try {
            const res = await fetch('/api/users/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.message || 'Failed to register')
            }

            const result = await res.json()
            setSuccessMessage(result.message || 'Registration successful!')
            reset()
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit(handleSubmitRegister)}
            className="flex flex-col gap-4 p-4 max-w-md mx-auto bg-white rounded shadow"
        >
            <h2 className="text-xl font-bold">Register</h2>

            <input
                type={'email'}
                {...register('email')}
                placeholder="Email"
                className="border p-2" />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}

            <input
                type="password"
                {...register('password')}
                placeholder="Password"
                className="border p-2"
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}

            <button type="submit" className="bg-green-500 text-white p-2 rounded" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
            </button>

            {error && <p className="text-red-500"> {error}</p>}
            {successMessage && <p className="text-green-600"> {successMessage}</p>}
        </form>
    )
}
