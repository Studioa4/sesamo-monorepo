import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Stabili from "./Stabili";
import Varchi from "./Varchi";
import Utenti from "./Utenti";
import Log from "./Log";
import Accessi from "./Accessi";
import InactivityAndTokenHandler from "../components/auth/InactivityAndTokenHandler";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "./Login";
import RecuperaPassword from "./RecuperaPassword";
import CambiaPassword from "./CambiaPassword";

// Layout con sidebar
const Layout = ({ children }) => (
  <div className="flex">
    <Sidebar />
    <main className="flex-1 p-6 bg-gray-50 min-h-screen">{children}</main>
  </div>
);

// ✅ App aggiornata con login prioritario e fallback sicuro
export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <InactivityAndTokenHandler />

      <Routes>
        {/* ✅ login deve stare per primo ed essere libero */}
        <Route path="/login" element={<Login />} />

        {/* ✅ fallback su pagina generica */}
        <Route path="*" element={<div className="p-6 text-center text-gray-500">Pagina non trovata</div>} />

        {/* ✅ root reindirizza solo se loggato */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/stabili" replace />
            </ProtectedRoute>
          }
        />
        <Route path="/recupera-password" element={<RecuperaPassword />} />
        <Route path="/cambia-password" element={<CambiaPassword />} />
        
        <Route
          path="/stabili"
          element={<ProtectedRoute><Layout><Stabili /></Layout></ProtectedRoute>}
        />
        <Route
          path="/varchi"
          element={<ProtectedRoute><Layout><Varchi /></Layout></ProtectedRoute>}
        />
        <Route
          path="/utenti"
          element={<ProtectedRoute><Layout><Utenti /></Layout></ProtectedRoute>}
        />
        <Route
          path="/accessi"
          element={<ProtectedRoute><Layout><Accessi /></Layout></ProtectedRoute>}
        />
        <Route
          path="/log"
          element={<ProtectedRoute><Layout><Log /></Layout></ProtectedRoute>}
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}
