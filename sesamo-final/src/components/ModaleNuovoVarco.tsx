
import { useState } from "react";

interface Props {
  onSalva: (varco: any) => void;
  onClose: () => void;
  condominioId: string;
}

export default function ModaleNuovoVarco({ onSalva, onClose, condominioId }: Props) {
  const [form, setForm] = useState({
    condominio_id: condominioId,
    denominazione: "",
    tipo_accesso: "",
    mac_gateway: "",
    device_id: "",
  });

  const tipiAccesso = [
    "Basculante",
    "Cancello carrabile",
    "Cancello pedonale",
    "Portoncino"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const salva = () => {
    if (!form.device_id || !form.mac_gateway || !form.condominio_id) {
      alert("Compila tutti i campi richiesti.");
      return;
    }
    onSalva({
      id_stabile: form.condominio_id,
      denominazione: form.denominazione,
      tipo_accesso: form.tipo_accesso,
      mac_gateway: form.mac_gateway,
      device_id: form.device_id,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-xl space-y-4">
        <h2 className="text-lg font-bold">➕ Nuovo Varco</h2>

        <input
          type="text"
          value={`ID stabile selezionato: ${condominioId}`}
          disabled
          className="w-full border px-2 py-1 bg-gray-100 rounded"
        />

        <input
          type="text"
          name="denominazione"
          placeholder="Es: Ingresso box"
          value={form.denominazione}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />

        <select name="tipo_accesso" value={form.tipo_accesso} onChange={handleChange} className="w-full border px-2 py-1 rounded">
          <option value="">-- Tipo di accesso --</option>
          {tipiAccesso.map((tipo) => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>

        <input
          type="text"
          name="mac_gateway"
          placeholder="MAC Gateway (es: B2B3A123)"
          value={form.mac_gateway}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />

        <input
          type="text"
          name="device_id"
          placeholder="Device ID (es: CCC-5309689)"
          value={form.device_id}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />

        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Annulla</button>
          <button onClick={salva} className="bg-blue-600 text-white px-4 py-2 rounded">Salva</button>
        </div>
      </div>
    </div>
  );
}
