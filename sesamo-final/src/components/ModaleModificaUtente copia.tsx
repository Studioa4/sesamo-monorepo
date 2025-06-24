
import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface Props {
  utente: any;
  onSalva: (utente: any) => void;
  onClose: () => void;
}

export default function ModaleModificaUtente({ utente, onSalva, onClose }: Props) {
  const [form, setForm] = useState({ ...utente });

  useEffect(() => {
    setForm(utente);
  }, [utente]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const salva = () => {
    if (!form.nome || !form.cognome || !form.email) {
      alert("Compila tutti i campi obbligatori.");
      return;
    }
    onSalva(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-xl space-y-4">
        <h2 className="text-lg font-bold">✏️ Modifica Utente</h2>

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

        <PhoneInput
          country={"it"}
          value={form.telefono}
          onChange={(value) => setForm((prev) => ({ ...prev, telefono: value }))}
          inputClass="w-full border px-2 py-1 rounded"
        />

        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
            Annulla
          </button>
          <button onClick={salva} className="bg-blue-600 text-white px-4 py-2 rounded">
            Salva
          </button>
        </div>
      </div>
    </div>
  );
}
