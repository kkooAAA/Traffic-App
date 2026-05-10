import {
    useState,
} from "react";

import api from "../services/api";

import { useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(
                "/auth/register",
                form
            );
            alert("Registration successful! Please login.");
            navigate("/login");
        } catch (err) {
            alert("Registration failed: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <form
                onSubmit={handleSubmit}
                className="bg-zinc-900 p-8 rounded-2xl w-[400px]"
            >
                <input
                    type="text"
                    placeholder="Username"
                    className="w-full p-3 rounded-xl bg-zinc-800 mb-4"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            username:
                                e.target.value,
                        })
                    }
                />

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
                    Register
                </button>

                <p className="text-center text-zinc-400 text-sm">
                    Already have an account?{" "}
                    <button 
                        onClick={() => navigate("/login")}
                        className="text-red-500 hover:underline"
                    >
                        Login
                    </button>
                </p>

                <div className="mt-6 text-center">
                    <button 
                        onClick={() => navigate("/privacy")}
                        className="text-[10px] text-zinc-600 hover:text-zinc-400 transition"
                    >
                        Privacy Policy
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Register;