"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supabaseClient_1 = require("../supabaseClient");
const uuid_1 = require("uuid");
const router = express_1.default.Router();
router.post("/api/autorizzazioni", async (req, res) => {
    try {
        const { varco_id, cellulare, ruolo, giorniAttivi, giorni, orariAttivi, ora_da, ora_a, remoto, escludi_festivi, } = req.body;
        // 1. Cerca l'utente tramite il numero di cellulare
        const { data: utenti, error: utenteError } = await supabaseClient_1.supabase
            .from("utenti_sesamo")
            .select("id")
            .eq("telefono", cellulare);
        if (utenteError || !utenti || utenti.length === 0) {
            return res.status(404).json({ error: "Utente non trovato" });
        }
        const utente_id = utenti[0].id;
        const creato_il = new Date().toISOString();
        const insertRows = [];
        if (ruolo === "proprietario") {
            // Nessuna limitazione, una singola riga
            insertRows.push({
                id: (0, uuid_1.v4)(),
                utente_id,
                varco_id,
                livello: ruolo,
                remoto,
                creato_il,
                creato_da: null,
                valido_dal: null,
                valido_al: null,
                giorno_settimana: null,
                ora_da: null,
                ora_a: null,
            });
        }
        else {
            // Utente o Fornitore: giorni/orari
            const giorniValidi = giorniAttivi ? giorni : [null];
            for (const giorno of giorniValidi) {
                insertRows.push({
                    id: (0, uuid_1.v4)(),
                    utente_id,
                    varco_id,
                    livello: ruolo,
                    remoto,
                    creato_il,
                    creato_da: null,
                    giorno_settimana: giorno,
                    ora_da: orariAttivi ? ora_da : null,
                    ora_a: orariAttivi ? ora_a : null,
                    valido_dal: null,
                    valido_al: null,
                    escludi_festivi: escludi_festivi ?? false,
                });
            }
        }
        const { error: insertError } = await supabaseClient_1.supabase
            .from("autorizzazioni_accesso")
            .insert(insertRows);
        if (insertError) {
            console.error("❌ Errore insert autorizzazioni:", insertError);
            return res.status(500).json({ error: "Errore salvataggio" });
        }
        return res.json({ success: true });
    }
    catch (err) {
        console.error("❌ Errore generico:", err);
        return res.status(500).json({ error: "Errore interno" });
    }
});
exports.default = router;
