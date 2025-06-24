import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

interface Props {
  onClose: () => void;
  onSalva: (accesso: any) => void;
  varchi: any[];
  id_stabile: string;
}

export default function ModaleAccessoUtente({ onClose, onSalva, varchi, id_stabile }: Props) {
  const [form, setForm] = useState({
    telefono: "",
    utente_id: "",
    varco_id: "",
    giorni_specifici: false,
    giorni: {
      lun: false,
      mar: false,
      mer: false,
      gio: false,
      ven: false,
      sab: false,
      dom: false,
    },
    orari_specifici: false,
    orario_da: "08:00",
    orario_a: "20:00",
    remoto: true,
  });

  const [utenteInfo, setUtenteInfo] = useState<any | null>(null);

  useEffect(() => {
    if (form.telefono.length > 5) {
      supabase
        .from("utenti_sesamo")
        .select("*")
        .eq("telefono", form.telefono)
        .single()
        .then(({ data }) => {
          if (data) {
            setUtenteInfo(data);
            setForm((prev) => ({ ...prev, utente_id: data.id }));
          } else {
            setUtenteInfo(null);
            setForm((prev) => ({ ...prev, utente_id: "" }));
          }
        });
    }
  }, [form.telefono]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleGiorniChange = (e: any) => {
    const { name, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      giorni: {
        ...prev.giorni,
        [name]: checked,
      },
    }));
  };

  const salva = () => {
    if (!form.utente_id || !form.varco_id) {
      alert("Compila tutti i campi richiesti.");
      return;
    }

    onSalva({
      ...form,
      id_stabile,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-2xl space-y-4">
        <h2 className="text-lg font-bold">➕ Nuovo Accesso</h2>

        <input
          type="text"
          name="telefono"
          placeholder="Numero di cellulare"
          value={form.telefono}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />

        {utenteInfo && (
          <p className="text-sm text-gray-700">
            Utente trovato: <strong>{utenteInfo.nome} {utenteInfo.cognome}</strong>
          </p>
        )}

        <select
          name="varco_id"
          value={form.varco_id}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        >
          <option value="">-- Seleziona Varco --</option>
          {varchi.map((v: any) => (
            <option key={v.id} value={v.id}>{v.denominazione}</option>
          ))}
        </select>

        <div>
          <label className="font-semibold flex items-center gap-2">
            <input type="checkbox" name="giorni_specifici" checked={form.giorni_specifici} onChange={handleChange} />
            Giorni della settimana
          </label>
          <div className="grid grid-cols-7 gap-2 mt-2">
            {["lun", "mar", "mer", "gio", "ven", "sab", "dom"].map((giorno) => (
              <label key={giorno} className="text-sm flex items-center gap-1">
                <input
                  type="checkbox"
                  name={giorno}
                  checked={form.giorni[giorno as keyof typeof form.giorni]}
                  disabled={!form.giorni_specifici}
                  onChange={handleGiorniChange}
                />
                {giorno.charAt(0).toUpperCase() + giorno.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="font-semibold flex items-center gap-2">
            <input type="checkbox" name="orari_specifici" checked={form.orari_specifici} onChange={handleChange} />
            Orari
          </label>
          <div className="flex gap-2 mt-2">
            <input
              type="time"
              name="orario_da"
              value={form.orario_da}
              disabled={!form.orari_specifici}
              onChange={handleChange}
              className="border px-2 py-1 rounded"
            />
            <input
              type="time"
              name="orario_a"
              value={form.orario_a}
              disabled={!form.orari_specifici}
              onChange={handleChange}
              className="border px-2 py-1 rounded"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="remoto" checked={form.remoto} onChange={handleChange} />
          <label>Apertura da remoto</label>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Annulla</button>
          <button onClick={salva} className="bg-blue-600 text-white px-4 py-2 rounded">Salva</button>
        </div>
      </div>
    </div>
  );
}
