import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function CambiaPassword() {
  const navigate = useNavigate();
  const [nuova, setNuova] = useState("");
  const [conferma, setConferma] = useState("");
  const [errore, setErrore] = useState("");
  const [successo, setSuccesso] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrore("");

    if (nuova.length < 8) {
      setErrore("La nuova password deve contenere almeno 8 caratteri.");
      return;
    }

    if (nuova !== conferma) {
      setErrore("Le password non corrispondono.");
      return;
    }

    const { data, error } = await supabase.auth.updateUser({
      password: nuova,
    });

    if (error) {
      console.error("Errore aggiornamento password:", error.message);
      setErrore("Errore durante il cambio password.");
      return;
    }

    const utente = JSON.parse(localStorage.getItem("utente") || "{}");

    if (utente?.id) {
      await supabase
        .from("utenti_sesamo")
        .update({ stato: "attivo" })
        .eq("id", utente.id);
    }

    setSuccesso(true);
    setTimeout(() => {
      navigate("/stabili");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
        <h1 className="text-xl font-bold mb-4 text-center">Cambio password</h1>

        {successo ? (
          <p className="text-green-600 text-center">Password aggiornata correttamente. Reindirizzamento...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Nuova password"
              value={nuova}
              onChange={(e) => setNuova(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
            <input
              type="password"
              placeholder="Conferma password"
              value={conferma}
              onChange={(e) => setConferma(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
            {errore && <p className="text-red-500 text-sm text-center">{errore}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Cambia password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
