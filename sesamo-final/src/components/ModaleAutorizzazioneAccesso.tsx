import { useEffect, useState } from "react";

const giorniSettimana = [
  "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica",
];

export default function ModaleAutorizzazioneAccesso({
  onClose,
  onSalva,
  utenti,
  varchi,
  iniziale,
}: {
  onClose: () => void;
  onSalva: (form: any) => void;
  utenti: any[];
  varchi: any[];
  iniziale?: any;
}) {
  const [telefono, setTelefono] = useState("");
  const [utenteValidato, setUtenteValidato] = useState<any | null>(
    iniziale?.utente_id
      ? utenti.find((u) => u.id === iniziale.utente_id)
      : null
  );

  const [form, setForm] = useState({
    id: iniziale?.id || null,
    utente_id: iniziale?.utente_id || "",
    varco_id: iniziale?.varco_id || "",
    livello: iniziale?.livello || "utente",
    giorni_attivi: iniziale?.giorni_attivi || false,
    orari_attivi: iniziale?.orari_attivi || false,
    accesso_remoto: iniziale?.accesso_remoto || false,
    giorni: iniziale?.giorni || [],
    ora_da: iniziale?.ora_da || "08:00",
    ora_a: iniziale?.ora_a || "18:00",
  });

  const aggiornaCampo = (campo: string, valore: any) => {
    setForm((prev) => ({ ...prev, [campo]: valore }));
  };

  const toggleGiorno = (giorno: string) => {
    setForm((prev) => ({
      ...prev,
      giorni: prev.giorni.includes(giorno)
        ? prev.giorni.filter((g) => g !== giorno)
        : [...prev.giorni, giorno],
    }));
  };

  const mostraOpzioni = form.livello === "utente" || form.livello === "fornitore";

  const handleTelefonoChange = (val: string) => {
    setTelefono(val);
    const trovato = utenti.find((u) => u.telefono === val);
    if (trovato) {
      setUtenteValidato(trovato);
      aggiornaCampo("utente_id", trovato.id);
    } else {
      setUtenteValidato(null);
      aggiornaCampo("utente_id", "");
    }
  };

  const handleSubmit = () => {
    if (!form.utente_id || !form.varco_id || !form.livello) {
      alert("Compila tutti i campi obbligatori");
      return;
    }
    onSalva(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-lg space-y-4">
        <h2 className="text-lg font-semibold">
          {iniziale?.id ? "Modifica Autorizzazione" : "Nuova Autorizzazione"}
        </h2>

        <div className="space-y-2">
          {!iniziale?.id && (
            <label className="block">
              Numero di cellulare *
              <input
                type="text"
                className="w-full border px-2 py-1 rounded"
                placeholder="Es. 3331234567"
                value={telefono}
                onChange={(e) => handleTelefonoChange(e.target.value)}
              />
            </label>
          )}

          {utenteValidato && (
            <div className="text-sm text-green-600">
              Utente trovato: {utenteValidato.nome} {utenteValidato.cognome}
            </div>
          )}

          {!utenteValidato && !iniziale?.id && telefono.length >= 8 && (
            <div className="text-sm text-red-600">
              Nessun utente trovato con questo numero.
            </div>
          )}

          <label className="block">
            Tipologia utente *
            <select
              className="w-full border px-2 py-1 rounded"
              value={form.livello}
              onChange={(e) => aggiornaCampo("livello", e.target.value)}
              disabled={!utenteValidato && !iniziale?.id}
            >
              <option value="amministratore">Amministratore</option>
              <option value="proprietario">Proprietario</option>
              <option value="fornitore">Fornitore</option>
              <option value="utente">Utente</option>
            </select>
          </label>

          <label className="block">
            Varco *
            <select
              className="w-full border px-2 py-1 rounded"
              value={form.varco_id}
              onChange={(e) => aggiornaCampo("varco_id", e.target.value)}
              disabled={!utenteValidato && !iniziale?.id}
            >
              <option value="">-- Seleziona --</option>
              {varchi.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.denominazione}
                </option>
              ))}
            </select>
          </label>

          {mostraOpzioni && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4 mt-2">
                <label className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={form.giorni_attivi}
                    onChange={(e) =>
                      aggiornaCampo("giorni_attivi", e.target.checked)
                    }
                    disabled={!utenteValidato && !iniziale?.id}
                  />
                  <span>Giorni attivi</span>
                </label>

                <label className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={form.orari_attivi}
                    onChange={(e) =>
                      aggiornaCampo("orari_attivi", e.target.checked)
                    }
                    disabled={!utenteValidato && !iniziale?.id}
                  />
                  <span>Orari attivi</span>
                </label>

                <label className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={form.accesso_remoto}
                    onChange={(e) =>
                      aggiornaCampo("accesso_remoto", e.target.checked)
                    }
                    disabled={!utenteValidato && !iniziale?.id}
                  />
                  <span>Accesso remoto</span>
                </label>
              </div>

              <div className="flex flex-wrap gap-3">
                {giorniSettimana.map((giorno) => (
                  <label key={giorno} className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={form.giorni.includes(giorno)}
                      onChange={() => toggleGiorno(giorno)}
                      disabled={!utenteValidato && !iniziale?.id}
                    />
                    <span>{giorno}</span>
                  </label>
                ))}
              </div>

              <div className="flex space-x-4">
                <label className="flex flex-col">
                  Ora da
                  <input
                    type="time"
                    value={form.ora_da}
                    onChange={(e) => aggiornaCampo("ora_da", e.target.value)}
                    className="border px-2 py-1 rounded"
                    disabled={!utenteValidato && !iniziale?.id}
                  />
                </label>
                <label className="flex flex-col">
                  Ora a
                  <input
                    type="time"
                    value={form.ora_a}
                    onChange={(e) => aggiornaCampo("ora_a", e.target.value)}
                    className="border px-2 py-1 rounded"
                    disabled={!utenteValidato && !iniziale?.id}
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Annulla
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.utente_id}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Salva
          </button>
        </div>
      </div>
    </div>
  );
}
