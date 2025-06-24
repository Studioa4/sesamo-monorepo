import { useState } from "react";

export default function ModaleModificaUtente({ utente, onClose, onSalva }: {
  utente: any;
  onClose: () => void;
  onSalva: (form: any) => void;
}) {
  const [form, setForm] = useState({
    id: utente.id,
    nome: utente.nome,
    cognome: utente.cognome,
    email: utente.email,
    telefono: utente.telefono,
    prefisso: utente.prefisso || "+39",
    stato: utente.stato || "non attivo",
  });

  const aggiorna = (campo: string, valore: any) => {
    setForm(prev => ({ ...prev, [campo]: valore }));
  };

  const handleSubmit = () => {
    onSalva(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-md space-y-4">
        <h2 className="text-lg font-bold">✏️ Modifica Utente</h2>

        <input
          type="text"
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => aggiorna("nome", e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
        <input
          type="text"
          placeholder="Cognome"
          value={form.cognome}
          onChange={(e) => aggiorna("cognome", e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => aggiorna("email", e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />

        <div className="flex gap-2">
          <select
            value={form.prefisso}
            onChange={(e) => aggiorna("prefisso", e.target.value)}
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
            placeholder="Telefono"
            value={form.telefono}
            onChange={(e) => aggiorna("telefono", e.target.value)}
            className="flex-1 border px-2 py-1 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Stato</label>
          <select
            value={form.stato}
            onChange={(e) => aggiorna("stato", e.target.value)}
            className="w-full border px-2 py-1 rounded"
          >
            <option value="non attivo">Non attivo</option>
            <option value="attivo">Attivo</option>
            <option value="sospeso">Sospeso</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
            Annulla
          </button>
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
            Salva
          </button>
        </div>
      </div>
    </div>
  );
}
