
import { useEffect, useState } from "react";
import BricklyGrid from "../components/BricklyGridWithOpenButton";
import ModaleNuovoVarco from "../components/ModaleNuovoVarco";
import { supabase } from "../supabaseClient";

export default function Varchi() {
  const [varchi, setVarchi] = useState<any[]>([]);
  const [condomini, setCondomini] = useState<any[]>([]);
  const [condominioSelezionato, setCondominioSelezionato] = useState("");
  const [mostraModale, setMostraModale] = useState(false);

  const caricaDati = async () => {
    const { data, error } = await supabase.from("varchi_stabili").select("*");
    if (data) setVarchi(data);
    if (error) console.error("Errore varchi:", error);
  };

  const caricaCondomini = async () => {
    const { data, error } = await supabase
      .from("condomini")
      .select("id, denominazione, indirizzo, cap, citta, provincia")
      .order("denominazione", { ascending: true });

    if (data) {
      const elenco = data.map((c) => ({
        id: c.id,
        descrizione: `${c.denominazione} - ${c.indirizzo} ${c.cap} ${c.citta} (${c.provincia})`,
      }));
      setCondomini(elenco);
    }
    if (error) console.error("Errore condomini:", error);
  };

  useEffect(() => {
    caricaDati();
    caricaCondomini();
  }, []);

  const handleSalva = async (form: any) => {
    const { data, error } = await supabase.from("varchi_stabili").insert([form]);
    if (error) {
      alert("Errore nel salvataggio.");
      console.error(error);
    } else {
      setMostraModale(false);
      caricaDati();
    }
  };

  const handleOpen = async (row: any) => {
    const conferma = confirm(`Vuoi aprire il varco "${row.denominazione}"?`);
    if (!conferma) return;

    try {
      const response = await fetch("http://localhost:4000/api/open-varco", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mac_gateway: row.mac_gateway,
          device_id: row.device_id,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert("✅ Varco aperto correttamente.");
      } else {
        alert("❌ Errore apertura: " + (result.details || result.error));
      }
    } catch (err) {
      console.error("Errore apertura:", err);
      alert("❌ Errore di rete o server.");
    }
  };

  const colonne = [
    { headerName: "Denominazione", field: "denominazione", flex: 2 },
    { headerName: "Tipo", field: "tipo_accesso", flex: 1 },
    { headerName: "MAC Gateway", field: "mac_gateway", flex: 2 },
    { headerName: "Device ID", field: "device_id", flex: 2 },
  ];

  const varchiFiltrati = condominioSelezionato
    ? varchi.filter((v) => v.id_stabile === condominioSelezionato)
    : [];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Gestione Varchi</h1>

      <select
        value={condominioSelezionato}
        onChange={(e) => setCondominioSelezionato(e.target.value)}
        className="border px-2 py-1 rounded"
      >
        <option value="">-- Seleziona stabile --</option>
        {condomini.map((c) => (
          <option key={c.id} value={c.id}>
            {c.descrizione}
          </option>
        ))}
      </select>

      {condominioSelezionato && (
        <>
          <div className="flex justify-end">
            <button
              onClick={() => setMostraModale(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              ➕ Nuovo Varco
            </button>
          </div>

          <BricklyGrid
            id="varchi"
            rowData={varchiFiltrati}
            columnDefs={colonne}
            onOpenVarco={handleOpen}
          />

          {mostraModale && (
            <ModaleNuovoVarco
              onSalva={handleSalva}
              onClose={() => setMostraModale(false)}
              condominioId={condominioSelezionato}
            />
          )}
        </>
      )}
    </div>
  );
}
