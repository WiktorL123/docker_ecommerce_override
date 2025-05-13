import {useEffect, useState} from "react";

export default function Users() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
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
            } catch (err) {
                console.error('❌ Error:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };


        fetchUsers()
    }, [])

    if (error) return <div>{error.message}</div>
    if (loading) return <div>loading...</div>
    return (
        <>
            <h1>Users PAGE</h1>
            {users.map((user) => (
                <div key={user.id}>{user.email} - {user.hashedPassword}</div>
            ))}
        </>
    )
}