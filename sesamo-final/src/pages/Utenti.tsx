import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import BricklyGrid from "../components/BricklyGrid";
import ModaleNuovoUtente from "../components/ModaleNuovoUtente";
import ModaleModificaUtente from "../components/ModaleModificaUtente";

export default function Utenti() {
  const [utenti, setUtenti] = useState<any[]>([]);
  const [modale, setModale] = useState<"nuovo" | "modifica" | null>(null);
  const [utenteSelezionato, setUtenteSelezionato] = useState<any | null>(null);

  useEffect(() => {
    carica();
  }, []);

  const carica = async () => {
    const { data, error } = await supabase.from("utenti_sesamo").select("*");
    if (!error && data) setUtenti(data);
  };

  const handleNuovoUtente = async (form: any) => {
    const tempPassword = crypto.randomUUID().slice(0, 12);
    const authRes = await supabase.auth.admin.createUser({
      email: form.email,
      password: tempPassword,
      email_confirm: true,
    });

    if (authRes.error || !authRes.data?.user?.id) {
      alert("Errore nella creazione dell'account utente.");
      console.error("❌ Supabase Auth error:", authRes.error);
      return;
    }

    const id_auth = authRes.data.user.id;

    const { error: dbError } = await supabase.from("utenti_sesamo").insert({
      id_auth,
      nome: form.nome,
      cognome: form.cognome,
      email: form.email,
      telefono: form.telefono,
      prefisso: form.prefisso,
      stato: "non attivo",
    });

    if (dbError) {
      alert("Errore nel salvataggio del database.");
      console.error("❌ Supabase DB error:", dbError);
      return;
    }

    const { error: mailError } = await supabase.functions.invoke("invia-password", {
      body: {
        email: form.email,
        password: tempPassword,
        nome: form.nome,
      },
    });

    if (mailError) {
      console.warn("⚠️ Utente creato, ma invio email fallito:", mailError.message);
      alert("Utente creato, ma non è stato possibile inviare l’email.");
    } else {
      alert("Utente creato e email inviata.");
    }

    setModale(null);
    carica();
  };

  const handleModificaUtente = async (form: any) => {
    if (!form.id) {
      console.error("⚠️ Nessun ID utente presente:", form);
      return;
    }

    const { data, error } = await supabase
      .from("utenti_sesamo")
      .update({
        nome: form.nome,
        cognome: form.cognome,
        telefono: form.telefono,
        email: form.email,
        prefisso: form.prefisso,
        stato: form.stato,
      })
      .eq("id", form.id)
      .select()
      .single();

    if (error) {
      alert("Errore durante la modifica dell'utente.");
      console.error("❌ Supabase update error:", error);
      return;
    }

    setModale(null);
    setUtenteSelezionato(null);
    carica();
  };

  const handleEliminaUtente = async (id: string) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo utente?")) return;

    const { error } = await supabase.from("utenti_sesamo").delete().eq("id", id);
    if (error) {
      alert("Errore durante l'eliminazione.");
      console.error("❌ Supabase delete error:", error);
    } else {
      carica();
    }
  };

   const handleResetPassword = async (utente: any) => {
  const conferma = window.confirm(`Vuoi resettare la password per ${utente.email}?`);
  if (!conferma) return;

  try {
    const { data, error } = await supabase.functions.invoke("reset-password", {
      body: {
        user_id: utente.id_auth,
        email: utente.email,
        nome: utente.nome,
      },
    });

    if (error) {
      alert("Errore durante il reset della password.");
      console.error("❌ Supabase Function error:", error);
      return;
    }

    alert("Password aggiornata e inviata via email.");
  } catch (err) {
    console.error("❌ Errore funzione:", err);
    alert("Errore imprevisto durante il reset.");
  }
};

  const colonne = [
    { headerName: "Nome", field: "nome", flex: 1 },
    { headerName: "Cognome", field: "cognome", flex: 1 },
    { headerName: "Email", field: "email", flex: 2 },
    { headerName: "Telefono", field: "telefono", flex: 1 },
    {
      headerName: "⚙️",
      field: "azioni",
      cellRenderer: (params: any) => (
        <div className="flex space-x-2">
          <button
            className="text-blue-600 hover:underline"
            title="Modifica"
            onClick={() => {
              setUtenteSelezionato(params.data);
              setModale("modifica");
            }}
          >
            ✏️
          </button>
          <button
            className="text-red-600 hover:underline"
            title="Elimina"
            onClick={() => handleEliminaUtente(params.data.id)}
          >
            🗑️
          </button>
          <button
            className="text-purple-600 hover:underline"
            title="Reset password"
            onClick={() => handleResetPassword(params.data)}
          >
            🔑
          </button>
        </div>
      ),
      width: 140,
      sortable: false,
      filter: false,
    },
  ];

  return (
    <main className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Gestione Utenti</h1>
        <button
          onClick={() => setModale("nuovo")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          ➕ Nuovo Utente
        </button>
      </div>

      <BricklyGrid id="utenti" rowData={utenti} columnDefs={colonne} />

      {modale === "nuovo" && (
        <ModaleNuovoUtente onClose={() => setModale(null)} />
      )}
      {modale === "modifica" && utenteSelezionato && (
        <ModaleModificaUtente
          utente={utenteSelezionato}
          onClose={() => {
            setModale(null);
            setUtenteSelezionato(null);
          }}
          onSalva={handleModificaUtente}
        />
      )}
    </main>
  );
}
