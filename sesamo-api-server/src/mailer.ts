import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export async function inviaEmailAccesso({
  emailDestinatario,
  nomeDestinatario,
  password,
}: {
  emailDestinatario: string;
  nomeDestinatario: string;
  password: string;
}) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT!) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });

  const mailOptions = {
    from: `"Sesamo" <${process.env.SMTP_USER!}>`,
    to: emailDestinatario,
    subject: "Accesso al portale Sesamo",
    html: `
      <p>Ciao <b>${nomeDestinatario}</b>,</p>
      <p>il tuo account è stato creato con successo.</p>
      <p><b>Email:</b> ${emailDestinatario}<br>
         <b>Password:</b> ${password}</p>
      <p>Puoi accedere al portale all'indirizzo: <a href="https://sesamo.brickly.it">https://sesamo.brickly.it</a></p>
      <p>Ti consigliamo di modificare la password al primo accesso.</p>
      <p>—<br>Il team Brickly</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}
