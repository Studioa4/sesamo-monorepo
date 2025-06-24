import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import BricklyGrid from "../components/BricklyGrid";
import ModaleModificaCondominio from "../components/ModaleModificaCondominio";
import ModaleNuovoCondominio from "../components/ModaleNuovoCondominio";


export default function Stabili() {
  const [dati, setDati] = useState<any[]>([]);
  const [modaleModificaAperto, setModaleModificaAperto] = useState(false);
  const [modaleNuovoAperto, setModaleNuovoAperto] = useState(false);
  const [condominioSelezionato, setCondominioSelezionato] = useState<any>(null);

  const carica = async () => {
    const { data } = await supabase.from("condomini").select("*").order("denominazione", { ascending: true });
    setDati(data || []);
  };

  useEffect(() => {
    carica();
  }, []);

  const colonne = [
    { headerName: "Denominazione", field: "denominazione", flex: 2 },
    { headerName: "Codice Fiscale", field: "codice_fiscale", flex: 2 },
    { headerName: "Indirizzo", field: "indirizzo", flex: 2 },
    { headerName: "CAP", field: "cap", flex: 1 },
    { headerName: "Città", field: "citta", flex: 1 },
    { headerName: "Provincia", field: "provincia", flex: 1 },
    {
      headerName: "Azioni",
      field: "id",
      cellRenderer: (params: any) => (
        <button
          className="text-blue-600 hover:underline"
          onClick={() => {
            setCondominioSelezionato(params.data);
            setModaleModificaAperto(true);
          }}
        >
          ✏️ Modifica
        </button>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Stabili</h1>
        <button onClick={() => setModaleNuovoAperto(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          ➕ Nuovo Condominio
        </button>
      </div>
      <BricklyGrid id="stabili" rowData={dati} columnDefs={colonne} />
      <ModaleModificaCondominio
        condominio={condominioSelezionato}
        open={modaleModificaAperto}
        onClose={() => setModaleModificaAperto(false)}
        onSave={carica}
      />
      <ModaleNuovoCondominio
        open={modaleNuovoAperto}
        onClose={() => setModaleNuovoAperto(false)}
        onCreated={carica}
      />
    </div>
  );
}