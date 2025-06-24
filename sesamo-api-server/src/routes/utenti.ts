import express from "express";
import { supabase } from "../supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { randomBytes } from "crypto";
import { inviaEmailAccesso } from "../mailer";

const router = express.Router();

function generaPasswordSicura() {
  return randomBytes(8).toString("hex"); // es. 'a3f4b2e7c9d1e0f3'
}

router.post("/", async (req, res) => {
  try {
    const { nome, cognome, email, telefono, prefisso } = req.body;

    const password = generaPasswordSicura();

    // 1. Crea utente in auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      console.error("❌ Errore creazione utente Auth:", authError);
      return res.status(500).json({ error: "Errore creazione Auth" });
    }

    // 2. Inserisci in tabella utenti_sesamo
    const { data, error } = await supabase
      .from("utenti_sesamo")
      .insert({
        id_auth: authUser.user.id, // Salva ID auth per riferimento
        nome,
        cognome,
        email,
        telefono,
        prefisso,
      })
      .select();

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return res.status(500).json({ error: "Errore durante l'inserimento" });
    }

    console.log("✅ Utente creato:", data?.[0]);

    // Dopo il console.log("✅ Utente creato...")
    await inviaEmailAccesso({
        emailDestinatario: email,
        nomeDestinatario: `${nome} ${cognome}`,
        password,
    });

    res.json({ success: true, utente: data?.[0], password });

  } catch (err) {
    console.error("❌ Errore generico:", err);
    res.status(500).json({ error: "Errore interno" });
  }
});

export default router;
