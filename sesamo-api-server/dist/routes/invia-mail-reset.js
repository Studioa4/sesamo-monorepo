"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const router = express_1.default.Router();
const transporter = nodemailer_1.default.createTransport({
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
    }
    catch (err) {
        console.error("Errore invio email:", err);
        return res.status(500).json({ error: "Errore durante l'invio dell'email" });
    }
});
exports.default = router;
