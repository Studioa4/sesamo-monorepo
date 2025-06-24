import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import openVarcoRoute from "./open-varco";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(openVarcoRoute);

app.listen(4000, () => {
  console.log("✅ API server avviato su http://localhost:4000");
});