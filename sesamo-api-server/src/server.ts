import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import openVarcoRoute from "./open-varco";
import utentiRouter from './routes/utenti';
import autorizzazioniRouter from "./routes/autorizzazioni";
import resetPasswordRouter from "./routes/invia-mail-reset";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(openVarcoRoute);
app.use('/api/utenti', utentiRouter);
app.use("/api", resetPasswordRouter);
app.use(autorizzazioniRouter);

app.listen(4000, () => {
  console.log("✅ API server avviato su http://localhost:4000");
});