import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

export default function OrdersForm({ onOrdersCreated, editingOrder, clearEditingOrder }) {
    const [apiError, setApiError] = useState(null);

    const users = JSON.parse(localStorage.getItem("users") || '[]');

    const schema = Yup.object().shape({
        product: Yup.string().required('Product is required').min(3, 'min 3 length').max(20, 'max 20 length'),
        quantity: Yup.number().required('Quantity is required').positive('Quantity must be positive'),
        userId: Yup.number().required('UserId is required').oneOf(users.map(u => u.id), "user must exist"),
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            product: '',
            quantity: 0,
            userId: users[0]?.id || '',
        }
    });

    const onSubmit = async (values) => {
        console.log('📦 Wysyłam:', values);
        const url = editingOrder
            ? `/api/orders/${editingOrder.id}`
            : '/api/orders/';
        const method = editingOrder ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Unknown error during order processing');
            }

            reset();
            onOrdersCreated?.();
            clearEditingOrder();

        } catch (error) {
            setApiError(error.message);
        }
    };



    useEffect(() => {
        if (editingOrder) {
            console.log('reset do:', editingOrder);
            console.log('typeof userId:', typeof editingOrder.userId);
            reset({
                product: editingOrder.product,
                quantity: editingOrder.quantity,
                userId: editingOrder.userId,
            });
        }
    }, [editingOrder]);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-md mx-auto bg-white shadow-md rounded p-6 space-y-4"
        >
            {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

            <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700">Product</label>
                <input
                    type="text"
                    placeholder="Product Name"
                    {...register('product')}
                    className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.product && <p className="text-red-500 text-xs mt-1">{errors.product.message}</p>}
            </div>

            <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700">Quantity</label>
                <input
                    type="number"
                    placeholder="Quantity"
                    {...register('quantity')}
                    className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
            </div>

            <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700">User</label>
                <select
                    {...register('userId')}
                    className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {users.map((u) => (
                        <option key={u.id} value={u.id}>
                            {u.email}
                        </option>
                    ))}
                </select>
                {errors.userId && <p className="text-red-500 text-xs mt-1">{errors.userId.message}</p>}
            </div>

            <div className="flex space-x-2">
                <button
                    type="submit"
                    disabled={!isValid}
                    className={`px-4 py-2 rounded text-white ${
                        editingOrder ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
                    } disabled:opacity-50`}
                >
                    {editingOrder ? 'Edytuj zamówienie' : 'Dodaj zamówienie'}
                </button>

                {editingOrder && (
                    <button
                        type="button"
                        onClick={clearEditingOrder}
                        className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
                    >
                        Anuluj edycję
                    </button>
                )}
            </div>
        </form>

    );
}
