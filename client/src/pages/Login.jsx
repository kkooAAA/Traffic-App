import {
    useState,
} from "react";

import api from "../services/api";

import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post(
                "/auth/login",
                form
            );

            localStorage.setItem(
                "token",
                response.data.token
            );
            localStorage.setItem(
                "userId",
                response.data.user.id
            );

            navigate("/");
            window.location.reload(); // Refresh to update navbar
        } catch (err) {
            alert("Login failed: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <form
                onSubmit={handleSubmit}
                className="bg-zinc-900 p-8 rounded-2xl w-[400px]"
            >
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 rounded-xl bg-zinc-800 mb-4"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            email: e.target.value,
                        })
                    }
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 rounded-xl bg-zinc-800 mb-4"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            password:
                                e.target.value,
                        })
                    }
                />

                <button className="w-full bg-red-500 p-3 rounded-xl mb-4">
                    Login
                </button>

                <p className="text-center text-zinc-400 text-sm">
                    Don't have an account?{" "}
                    <button 
                        onClick={() => navigate("/register")}
                        className="text-red-500 hover:underline"
                    >
                        Register
                    </button>
                </p>
            </form>
        </div>
    );
}

export default Login;