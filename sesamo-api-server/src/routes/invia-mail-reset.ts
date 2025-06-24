import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: "smtps.aruba.it",
  port: 465,
  secure: true,
  auth: {
    user: "sesamo@brickly.cloud",
    pass: "Brickly2025!",
  },
});

router.post("/invia-mail-reset", async (req, res) => {
  const { email, password, nome } = req.body;

  if (!email || !password || !nome) {
    return res.status(400).json({ error: "Parametri mancanti" });
  }

  const mailOptions = {
    from: '"Sesamo  Notifiche" <sesamo@brickly.cloud>',
    to: email,
    subject: "Reset password Sesamo",
    text: `Ciao ${nome},

la tua password è stata resettata.

📌 Nuova password temporanea: ${password}

Accedi alla piattaforma Sesamo e aggiorna subito la password.

Grazie,
Il team Sesamo`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Errore invio email:", err);
    return res.status(500).json({ error: "Errore durante l'invio dell'email" });
  }
});

export default router;
