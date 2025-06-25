import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function RecuperaPassword() {
  const [email, setEmail] = useState("");
  const [stato, setStato] = useState<"idle" | "inviando" | "completato">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStato("inviando");

    await supabase.functions.invoke("reset-password", {
      body: {
        email,
        nome: "Utente"
      }
    });

    setStato("completato");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
        <div className="mb-4 text-center">
          <img src="/logo.png" className="h-72 mx-auto mb-4" />
        </div>
        <h1 className="text-xl font-bold mb-4 text-center">Recupera password</h1>
        {stato === "completato" ? (
          <>
            <p className="text-green-600 text-center">
              Se l’email è corretta, riceverai una nuova password.
            </p>
            <div className="text-center mt-4">
              <a href="/login" className="text-blue-600 hover:underline text-sm">
                Torna al login
              </a>
            </div>
          </>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                className="w-full border px-3 py-2 rounded"
                placeholder="La tua email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                disabled={stato === "inviando"}
              >
                {stato === "inviando" ? "Invio in corso..." : "Invia nuova password"}
              </button>
            </form>
            <div className="text-center mt-4">
              <a href="/login" className="text-blue-600 hover:underline text-sm">
                Torna al login
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
