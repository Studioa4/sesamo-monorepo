import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function ModaleNuovoCondominio({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    denominazione: "",
    codice_fiscale: "",
    indirizzo: "",
    cap: "",
    citta: "",
    provincia: "",
  });

  const [errore, setErrore] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalva = async () => {
    setLoading(true);
    const { error } = await supabase.from("condomini").insert([form]);
    setLoading(false);
    if (error) {
      setErrore("Errore durante il salvataggio");
    } else {
      onClose();
      if (onCreated) onCreated();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-xl">
        <h2 className="text-xl font-bold mb-4">➕ Nuovo Condominio</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <input name="denominazione" value={form.denominazione} onChange={handleChange} placeholder="Denominazione" className="border p-2 rounded" />
          <input name="codice_fiscale" value={form.codice_fiscale} onChange={handleChange} placeholder="Codice Fiscale" className="border p-2 rounded" />
          <input name="indirizzo" value={form.indirizzo} onChange={handleChange} placeholder="Indirizzo" className="border p-2 rounded" />
          <input name="cap" value={form.cap} onChange={handleChange} placeholder="CAP" className="border p-2 rounded" />
          <input name="citta" value={form.citta} onChange={handleChange} placeholder="Città" className="border p-2 rounded" />
          <input name="provincia" value={form.provincia} onChange={handleChange} placeholder="Provincia" className="border p-2 rounded" />
        </div>
        {errore && <p className="text-red-600 text-sm mt-2">{errore}</p>}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded">Annulla</button>
          <button onClick={handleSalva} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">Salva</button>
        </div>
      </div>
    </div>
  );
}