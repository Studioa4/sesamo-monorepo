export default function Log() {
  const log = [
    { data: "2025-06-14 08:15", utente: "Mario Rossi", esito: "✅ Accesso consentito" },
    { data: "2025-06-14 08:45", utente: "Luca Bianchi", esito: "❌ Accesso negato" },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Registro Accessi</h1>
      <table className="w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Data</th>
            <th className="p-2">Utente</th>
            <th className="p-2">Esito</th>
          </tr>
        </thead>
        <tbody>
          {log.map((r, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{r.data}</td>
              <td className="p-2">{r.utente}</td>
              <td className="p-2">{r.esito}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}