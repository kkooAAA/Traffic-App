import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useLanguage } from "../context/LanguageContext";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [userData, setUserData] = useState(null);
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    if (token) {
      fetchUser();
    }

    const handleUpdate = () => fetchUser();
    window.addEventListener("userUpdate", handleUpdate);
    return () => window.removeEventListener("userUpdate", handleUpdate);
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/me");
      setUserData(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    setUserData(null);
    navigate("/login");
  };

  const getLevel = (credits) => {
    if (credits >= 100) return { name: "Guardian", color: "text-blue-400", discount: true };
    if (credits >= 50) return { name: "Sentinel", color: "text-yellow-400", discount: true };
    if (credits >= 20) return { name: "Scout", color: "text-zinc-300", discount: true };
    return { name: "Rookie", color: "text-zinc-500", discount: false };
  };

  const level = userData ? getLevel(userData.credits) : null;

  return (
    <div className="bg-zinc-950 text-white p-3 md:p-4 flex flex-row justify-between items-center fixed top-0 w-full z-[10000] border-b border-zinc-900 flex-nowrap">
      <div className="flex items-center gap-2 md:gap-4">
        <h1 className="font-bold text-base md:text-xl whitespace-nowrap">
          <Link to="/">{t.app_name}</Link>
        </h1>
        {userData && (
          <div className="flex items-center gap-2 md:gap-3 border-l border-zinc-800 pl-2 md:pl-4">
            <div className="flex flex-col">
              <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-wider ${level.color}`}>
                {level.name}
              </span>
              <span className="text-[10px] md:text-xs font-mono text-zinc-400">
                {userData.credits} pts
              </span>
            </div>
            {level.discount && (
              <span className="bg-blue-500/10 text-blue-400 text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 rounded border border-blue-500/20 animate-pulse hidden sm:inline-block">
                {t.toll_discount}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-row gap-2 md:gap-4 text-xs md:text-base items-center whitespace-nowrap">
        <button 
          onClick={() => setLang(lang === 'en' ? 'th' : 'en')}
          className="bg-zinc-800 px-2 py-1 rounded text-[10px] font-bold hover:bg-zinc-700 transition"
        >
          {lang === 'en' ? 'TH' : 'EN'}
        </button>

        {token ? (
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-[10px] md:text-sm text-zinc-500 hidden xs:inline">@{userData?.username}</span>
            <button 
              onClick={handleLogout}
              className="bg-red-500 px-2 md:px-3 py-1 rounded hover:bg-red-600 transition text-[10px] md:text-sm font-bold"
            >
              {t.logout}
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="hover:text-red-500 transition">{t.login}</Link>
            <Link to="/register" className="bg-red-500 px-2 md:px-3 py-1 rounded hover:bg-red-600 transition font-bold">
              {t.register}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;