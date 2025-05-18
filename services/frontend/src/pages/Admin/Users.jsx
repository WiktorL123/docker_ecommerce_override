import { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader.jsx";

export default function Users() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);

    const handleDelete = async (id) =>{
        try {
            const res = await fetch(`/api/users/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                }
            })
            if (!res.ok) {
                const errData = await res.json(); // <== pobieramy message z API
                throw new Error(errData.message || "Nie udało się usunąć użytkownika.");
            }
            setUsers((prevState) => prevState.filter(user => user.id !== id));



        }catch(error){
            setError(error.message);
        }
    }



    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const resp = await fetch('/api/users/');

                console.log('⬅️ Raw response:', resp);

                if (!resp.ok) {
                    const text = await resp.text();
                    throw new Error(`Unexpected response: ${resp.status} ${text}`);
                }

                const data = await resp.json();
                setUsers(data);
                localStorage.setItem("users", JSON.stringify(data));
            } catch (err) {
                console.error('❌ Error:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (error) return <div className="text-red-600">{error.message}</div>;
    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div>
            <AdminHeader />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Users</h1>
                <div className="space-y-4">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="flex justify-between items-center border rounded p-4 shadow-sm"
                        >
                            <span className="text-gray-800">{user.email}</span>
                            <button
                                onClick={()=>handleDelete(user.id)}
                                className="text-sm text-red-600 border border-red-500 px-3 py-1 rounded hover:bg-red-50 transition"
                            >
                                Usuń
                            </button>
                        </div>
                    ))}
                </div>
                {error && <div className='text-red-500'>{error}</div>}
            </div>
        </div>
    );
}
