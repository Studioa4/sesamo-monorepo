"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inviaPasswordEmail = inviaPasswordEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function inviaPasswordEmail(destinatario, password) {
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
    const mailOptions = {
        from: `"Brickly Accessi" <${process.env.SMTP_USER}>`,
        to: destinatario,
        subject: "Accesso al portale Brickly",
        html: `
      <h2>Benvenuto!</h2>
      <p>Il tuo accesso al portale è stato attivato.</p>
      <p><strong>Login:</strong> ${destinatario}</p>
      <p><strong>Password:</strong> ${password}</p>
      <p>Puoi accedere al portale da: <a href="https://app.brickly.it">https://app.brickly.it</a></p>
    `,
    };
    await transporter.sendMail(mailOptions);
}
