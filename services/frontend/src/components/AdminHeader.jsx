import { useLocation, useNavigate } from "react-router-dom";

export default function AdminHeader() {
    const navigate = useNavigate();
    const location = useLocation();

    const routes = [
        { name: 'Dashboard', path: '/admin' },
        { name: 'Orders', path: '/admin/orders' },
        { name: 'Users', path: '/admin/users' },
    ];

    return (
        <div className="flex gap-4 items-center px-6 py-4 border-b shadow bg-white">
            {routes
                .filter((route) => route.path !== location.pathname)
                .map((route) => (
                    <button
                        key={route.path}
                        onClick={() => navigate(route.path)}
                        className="text-blue-600 hover:underline capitalize"
                    >
                        {route.name}
                    </button>
                ))}
        </div>
    );
}
