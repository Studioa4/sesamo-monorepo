import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import BricklyGrid from "../components/BricklyGrid";
import ModaleAutorizzazioneAccesso from "../components/ModaleAutorizzazioneAccesso";

export default function Accessi() {
  const [condomini, setCondomini] = useState<any[]>([]);
  const [condominioSelezionato, setCondominioSelezionato] = useState<string>("");
  const [autorizzazioni, setAutorizzazioni] = useState<any[]>([]);
  const [utenti, setUtenti] = useState<any[]>([]);
  const [varchi, setVarchi] = useState<any[]>([]);
  const [mostraModale, setMostraModale] = useState(false);
  const [rigaSelezionata, setRigaSelezionata] = useState<any | null>(null);

  useEffect(() => {
    caricaCondomini();
  }, []);

  useEffect(() => {
    if (condominioSelezionato) {
      caricaAutorizzazioni();
      caricaUtenti();
      caricaVarchi();
    }
  }, [condominioSelezionato]);

  const caricaCondomini = async () => {
    const { data, error } = await supabase
      .from("condomini")
      .select("id, denominazione, indirizzo, cap, citta, provincia")
      .order("denominazione", { ascending: true });

    if (!error && data) {
      const elenco = data.map((c) => ({
        id: c.id,
        descrizione: `${c.denominazione} - ${c.indirizzo} ${c.cap} ${c.citta} (${c.provincia})`,
      }));
      setCondomini(elenco);
    }
  };

  const caricaUtenti = async () => {
    const { data } = await supabase.from("utenti_sesamo").select("*");
    if (data) setUtenti(data);
  };

  const caricaVarchi = async () => {
    const { data } = await supabase
      .from("varchi_stabili")
      .select("id, denominazione")
      .eq("id_stabile", condominioSelezionato);
    if (data) setVarchi(data);
  };

  const caricaAutorizzazioni = async () => {
    const { data, error } = await supabase
      .from("autorizzazioni_accesso")
      .select(`
        id,
        utente_id,
        varco_id,
        livello,
        giorni_attivi,
        orari_attivi,
        accesso_remoto,
        giorni,
        ora_da,
        ora_a,
        utenti_sesamo!autorizzazioni_accesso_utente_id_fkey (
          nome,
          cognome
        ),
        varchi_stabili (
          denominazione
        )
      `)
      .eq("id_stabile", condominioSelezionato);

    if (error) {
      console.error("Errore caricamento autorizzazioni:", error);
      return;
    }

    if (data) {
      const mapped = data.map((row) => ({
        id: row.id,
        utente_id: row.utente_id,
        varco_id: row.varco_id,
        livello: row.livello,
        giorni_attivi: row.giorni_attivi,
        orari_attivi: row.orari_attivi,
        accesso_remoto: row.accesso_remoto,
        giorni: row.giorni || [],
        ora_da: row.ora_da || "08:00",
        ora_a: row.ora_a || "18:00",
        utente: row.utenti_sesamo
          ? `${row.utenti_sesamo.nome} ${row.utenti_sesamo.cognome}`
          : "—",
        varco: row.varchi_stabili?.denominazione || "—",
      }));
      setAutorizzazioni(mapped);
    }
  };

  const handleSalva = async (form: any) => {
    const payload = {
      utente_id: form.utente_id,
      varco_id: form.varco_id,
      livello: form.livello,
      giorni_attivi: form.giorni_attivi,
      orari_attivi: form.orari_attivi,
      accesso_remoto: form.accesso_remoto,
      giorni: form.giorni,
      ora_da: form.ora_da,
      ora_a: form.ora_a,
    };

    const { error } = form.id
      ? await supabase.from("autorizzazioni_accesso").update(payload).eq("id", form.id)
      : await supabase.from("autorizzazioni_accesso").insert({
          ...payload,
          id_stabile: condominioSelezionato,
        });

    if (!error) {
      setMostraModale(false);
      setRigaSelezionata(null);
      caricaAutorizzazioni();
    } else {
      alert("Errore salvataggio autorizzazione");
      console.error(error);
    }
  };

  const handleElimina = async (id: string) => {
    if (window.confirm("Sei sicuro di voler eliminare questa autorizzazione?")) {
      const { error } = await supabase
        .from("autorizzazioni_accesso")
        .delete()
        .eq("id", id);

      if (!error) caricaAutorizzazioni();
      else {
        alert("Errore durante l'eliminazione");
        console.error(error);
      }
    }
  };

  const colonne = [
    { headerName: "Utente", field: "utente", flex: 2 },
    { headerName: "Varco", field: "varco", flex: 2 },
    {
      headerName: "Giorni",
      field: "giorni_attivi",
      cellRenderer: (params: any) => (
        <input type="checkbox" checked={params.value} disabled />
      ),
      width: 100,
    },
    {
      headerName: "Orari",
      field: "orari_attivi",
      cellRenderer: (params: any) => (
        <input type="checkbox" checked={params.value} disabled />
      ),
      width: 100,
    },
    {
      headerName: "Remoto",
      field: "accesso_remoto",
      cellRenderer: (params: any) => (
        <input type="checkbox" checked={params.value} disabled />
      ),
      width: 100,
    },
    {
      headerName: "⚙️",
      field: "azioni",
      cellRenderer: (params: any) => (
        <div className="flex space-x-2">
          <button
            title="Modifica"
            onClick={() => {
              setRigaSelezionata(params.data);
              setMostraModale(true);
            }}
            className="text-blue-600 hover:underline"
          >
            ✏️
          </button>
          <button
            title="Elimina"
            onClick={() => handleElimina(params.data.id)}
            className="text-red-600 hover:underline"
          >
            🗑️
          </button>
        </div>
      ),
      width: 100,
      sortable: false,
      filter: false,
    },
  ];

  return (
    <main className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Autorizzazioni Accesso</h1>
        <button
          onClick={() => {
            setRigaSelezionata(null);
            setMostraModale(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          ➕ Nuovo
        </button>
      </div>

      <select
        className="w-full border px-2 py-2 rounded"
        value={condominioSelezionato}
        onChange={(e) => setCondominioSelezionato(e.target.value)}
      >
        <option value="">-- Seleziona un condominio --</option>
        {condomini.map((c) => (
          <option key={c.id} value={c.id}>
            {c.descrizione}
          </option>
        ))}
      </select>

      {condominioSelezionato && (
        <BricklyGrid
          id="autorizzazioni"
          rowData={autorizzazioni}
          columnDefs={colonne}
        />
      )}

      {mostraModale && (
        <ModaleAutorizzazioneAccesso
          onClose={() => {
            setMostraModale(false);
            setRigaSelezionata(null);
          }}
          onSalva={handleSalva}
          utenti={utenti}
          varchi={varchi}
          iniziale={rigaSelezionata}
        />
      )}
    </main>
  );
}
