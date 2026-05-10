import {
    useEffect,
    useState,
} from "react";

import { io } from "socket.io-client";

import api from "../services/api";

import Map from "../components/Map";

import IncidentForm from "../components/IncidentForm";

import Dashboard from "../components/Dashboard";
import { useLanguage } from "../context/LanguageContext";

const API_URL = import.meta.env.VITE_API_BASE_URL || "";
const SOCKET_URL = API_URL.replace("/api", "");

const socket = io(SOCKET_URL);

function Home() {
    const { t } = useLanguage();
    const [incidents, setIncidents] =
        useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [showDashboard, setShowDashboard] = useState(false);

    const [
        selectedLocation,
        setSelectedLocation,
    ] = useState(null);

    const [form, setForm] = useState({
        title: "",

        description: "",

        type: "accident",

        severity: "medium",
    });

    useEffect(() => {
        fetchIncidents();

        socket.on("connect", () => {
            console.log("Connected to socket server");
        });

        socket.on("creditUpdate", ({ userId, credits }) => {
            const currentUserId = localStorage.getItem("userId");
            if (userId === currentUserId) {
                // Fetch fresh user data or update local state if we had a global user context
                // For now, let's just show a notification and trigger a refresh of Navbar if possible
                // We'll use a window event to notify the Navbar
                window.dispatchEvent(new CustomEvent("userUpdate"));
                console.log(`Credits updated: ${credits}`);
            }
        });

        socket.on(
            "newIncident",
            (incident) => {
                console.log("New incident received:", incident);
                setIncidents((prev) => {
                    // Avoid duplicates
                    if (prev.some(inc => inc._id === incident._id)) return prev;
                    return [incident, ...prev];
                });
            }
        );

        socket.on(
            "deleteIncident",
            (id) => {
                setIncidents((prev) => 
                    prev.filter(inc => inc._id !== id)
                );
            }
        );

        return () => {
            socket.off("newIncident");
            socket.off("deleteIncident");
        };
    }, []);

    const fetchIncidents = async () => {
        try {
            setLoading(true);
            const response = await api.get(
                "/incidents"
            );
            setIncidents(response.data);
        } catch (err) {
            console.error("Failed to fetch incidents", err);
        } finally {
            setLoading(false);
        }
    };

    const deleteIncident = async (id) => {
        try {
            await api.delete(`/incidents/${id}`);
            setIncidents(prev => prev.filter(inc => inc._id !== id));
        } catch (err) {
            alert("Cannot delete: " + (err.response?.data?.message || err.message));
        }
    };

    const createIncident = async () => {
        if (!selectedLocation) {
            return alert(
                t.select_location
            );
        }

        try {
            setSubmitting(true);
            const response = await api.post("/incidents", {
                ...form,

                location: {
                    type: "Point",

                    coordinates:
                        selectedLocation,
                },
            });

            // Optimistic/Immediate update
            setIncidents(prev => {
                if (prev.some(inc => inc._id === response.data._id)) return prev;
                return [response.data, ...prev];
            });

            setShowForm(false);
            setForm({
                title: "",
                description: "",
                type: "accident",
                severity: "medium",
            });
            setSelectedLocation(null);
        } catch (err) {
            alert("Failed to report: " + (err.response?.data?.message || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="relative h-screen overflow-hidden bg-zinc-950">
            {loading && (
                <div className="absolute inset-0 bg-black/50 z-[20000] flex items-center justify-center backdrop-blur-sm">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-white font-bold">{t.loading}</p>
                    </div>
                </div>
            )}
            <Map
                incidents={incidents}
                setSelectedLocation={
                    setSelectedLocation
                }
                deleteIncident={deleteIncident}
                socket={socket}
            />

            {/* Mobile Toggles */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-[10000] md:hidden w-full px-6 max-w-[400px]">
                <button 
                    onClick={() => { setShowForm(!showForm); setShowDashboard(false); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold shadow-2xl transition active:scale-95 border ${
                        showForm 
                        ? 'bg-red-500 text-white border-red-400' 
                        : 'bg-zinc-900 text-white border-zinc-700 backdrop-blur-md'
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {showForm ? t.close : t.report}
                </button>
                <button 
                    onClick={() => { setShowDashboard(!showDashboard); setShowForm(false); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold shadow-2xl transition active:scale-95 border ${
                        showDashboard 
                        ? 'bg-blue-500 text-white border-blue-400' 
                        : 'bg-zinc-900 text-white border-zinc-700 backdrop-blur-md'
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                    </svg>
                    {showDashboard ? t.close : t.list}
                </button>
            </div>

            <div className={`${showForm ? 'flex' : 'hidden'} md:flex`}>
                <IncidentForm
                    form={{ ...form, submitting }}
                    setForm={setForm}
                    createIncident={
                        createIncident
                    }
                    onClose={() => setShowForm(false)}
                />
            </div>

            <div className={`${showDashboard ? 'flex' : 'hidden'} md:flex`}>
                <Dashboard 
                    incidents={incidents} 
                    deleteIncident={deleteIncident} 
                    onClose={() => setShowDashboard(false)}
                    socket={socket}
                />
            </div>
        </div>
    );
}

export default Home;
