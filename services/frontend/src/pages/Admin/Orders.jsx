import { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader.jsx";
import OrdersForm from "../../components/OrdersForm.jsx";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingOrder, setEditingOrder] = useState(null);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/orders/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token')
                }
            })
            if (!response.ok) {
                const errData = await response.json();
                throw new Error("błąd:", errData.message);
            }
            setOrders(prevState => prevState.filter(order => order.id !== id));
        }catch(err) {
            setError(err);
        }
    }

    const fetchOrders = async () => {
        try {
            const response = await fetch("/api/orders/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || "Coś poszło nie tak!");
            }

            const data = await response.json();
            setOrders(data.orders);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);


    if (loading) return <div className="p-6">Loading...</div>;
    if (error) return <div className="text-red-600 p-6">Error: {error}</div>;

    return (
        <div>
            <AdminHeader />
            <div className="p-6">
                <OrdersForm
                    onOrdersCreated={fetchOrders}
                    editingOrder={editingOrder}
                    clearEditingOrder={() => setEditingOrder(null)}
                />
                <h1 className="text-2xl font-bold mb-4">Orders</h1>
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="flex justify-between items-center border rounded p-4 shadow-sm"
                        >
                            <div className="text-gray-800">
                                <div className="font-medium">Produkt: {order.product}</div>
                                <div>Ilość: {order.quantity}</div>
                                <div>Użytkownik ID: {order.userId}</div>
                            </div>
                            <button
                                onClick={() => {
                                    handleDelete(order.id)
                                }}
                                className="text-sm text-red-600 border border-red-500 px-3 py-1 rounded hover:bg-red-50 transition"
                            >
                                Usuń
                            </button>
                            <button
                                onClick={()=>setEditingOrder(order)}
                                className="text-sm text-blue-600 border border-blue-500 px-3 py-1 rounded hover:bg-red-50 transition"
                            >
                                edytuj
                            </button>
                        </div>
                    ))}
                </div>
                {error && <div className="text-red-500 mt-4">{error}</div>}
            </div>
        </div>
    );
}
