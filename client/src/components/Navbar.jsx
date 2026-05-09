import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="bg-zinc-950 text-white p-3 md:p-4 flex flex-row justify-between items-center fixed top-0 w-full z-[10000] border-b border-zinc-900 flex-nowrap">
      <h1 className="font-bold text-lg md:text-xl whitespace-nowrap">
        <Link to="/">Traffic App</Link>
      </h1>

      <div className="flex flex-row gap-2 md:gap-4 text-sm md:text-base items-center whitespace-nowrap">
        <Link to="/" className="hidden sm:block hover:text-red-500 transition">Home</Link>

        {token ? (
          <button 
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="hover:text-red-500 transition">Login</Link>
            <Link to="/register" className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;