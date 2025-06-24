import { useState } from "react";
import { toast } from "react-toastify";

interface Props {
  onClose: () => void;
}

export default function ModaleNuovoUtente({ onClose }: Props) {
  const [form, setForm] = useState({
    nome: "",
    cognome: "",
    email: "",
    prefisso: "+39",
    telefono: "",
    stato: "non attivo",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const salva = async () => {
    if (!form.nome || !form.cognome || !form.email || !form.telefono) {
      toast.warning("Compila tutti i campi.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/utenti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Errore invio:", text);
        toast.error("Errore durante la creazione dell'utente.");
        return;
      }

      const data = await res.json();
      console.log("✅ Risposta API:", data);
      toast.success("Utente creato correttamente!");
      onClose();
    } catch (err) {
      console.error("❌ Errore invio:", err);
      toast.error("Errore imprevisto durante la creazione.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-md space-y-4">
        <h2 className="text-lg font-bold">➕ Nuovo Utente</h2>

        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={form.nome}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />
        <input
          type="text"
          name="cognome"
          placeholder="Cognome"
          value={form.cognome}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />

        <div className="flex gap-2">
          <select
            name="prefisso"
            value={form.prefisso}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-24"
          >
            <option value="+39">🇮🇹 +39</option>
            <option value="+33">🇫🇷 +33</option>
            <option value="+41">🇨🇭 +41</option>
            <option value="+49">🇩🇪 +49</option>
            <option value="+44">🇬🇧 +44</option>
          </select>
          <input
            type="tel"
            name="telefono"
            placeholder="Telefono"
            value={form.telefono}
            onChange={handleChange}
            className="flex-1 border px-2 py-1 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Stato</label>
          <select
            name="stato"
            value={form.stato}
            disabled
            className="w-full border px-2 py-1 rounded bg-gray-100 text-gray-600"
          >
            <option value="non attivo">Non attivo</option>
            <option value="attivo">Attivo</option>
            <option value="sospeso">Sospeso</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Annulla</button>
          <button onClick={salva} className="bg-blue-600 text-white px-4 py-2 rounded">Salva</button>
        </div>
      </div>
    </div>
  );
}
