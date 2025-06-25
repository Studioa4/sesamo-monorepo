import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleLogout = async () => {
    console.log("🔓 Logout manuale cliccato");
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("❌ Errore nel logout:", error.message);
    } else {
      console.log("✅ Logout Supabase riuscito");
    }
  };

  const menuItems = [
    { label: "Stabili", icon: "🏢", path: "/stabili" },
    { label: "Varchi", icon: "🚪", path: "/varchi" },
    { label: "Utenti", icon: "👤", path: "/utenti" },
    { label: "Accessi", path: "/accessi", icon: "🗝️" },
    { label: "Log", icon: "📄", path: "/log" }
  ];

  return (
    <div className="w-64 h-screen bg-blue-300 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700 text-center">
        <img src="/logo.png" className="h-48 mx-auto" alt="Sesamo Logo" />
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map(({ label, icon, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-md text-left ${isActive(path) ? "bg-blue-600 font-semibold" : "hover:bg-gray-700"}`}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* Logout in fondo */}
      <div className="px-4 py-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 rounded-md text-left text-red-700 hover:bg-gray-400"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}