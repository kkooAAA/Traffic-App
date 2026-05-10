import {
    useEffect,
    useState,
} from "react";

import { io } from "socket.io-client";

import api from "../services/api";

import Map from "../components/Map";

import IncidentForm from "../components/IncidentForm";

import Dashboard from "../components/Dashboard";

const API_URL = import.meta.env.VITE_API_BASE_URL || "";
const SOCKET_URL = API_URL.replace("/api", "");

const socket = io(SOCKET_URL);

function Home() {
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
                "Please click on the map to select a location first"
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
                        <p className="text-white font-bold">Loading Map Data...</p>
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
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-[10000] md:hidden">
                <button 
                    onClick={() => { setShowForm(!showForm); setShowDashboard(false); }}
                    className={`px-4 py-2 rounded-full font-bold shadow-lg transition ${showForm ? 'bg-red-500 text-white' : 'bg-zinc-900 text-white border border-zinc-700'}`}
                >
                    {showForm ? 'Close' : 'Report'}
                </button>
                <button 
                    onClick={() => { setShowDashboard(!showDashboard); setShowForm(false); }}
                    className={`px-4 py-2 rounded-full font-bold shadow-lg transition ${showDashboard ? 'bg-red-500 text-white' : 'bg-zinc-900 text-white border border-zinc-700'}`}
                >
                    {showDashboard ? 'Close' : 'List'}
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
