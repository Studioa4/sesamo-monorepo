"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const open_varco_1 = __importDefault(require("./open-varco"));
const utenti_1 = __importDefault(require("./routes/utenti"));
const autorizzazioni_1 = __importDefault(require("./routes/autorizzazioni"));
const invia_mail_reset_1 = __importDefault(require("./routes/invia-mail-reset"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(open_varco_1.default);
app.use('/api/utenti', utenti_1.default);
app.use("/api", invia_mail_reset_1.default);
app.use(autorizzazioni_1.default);
app.get("/", (_req, res) => {
    res.send("API attiva 🚀");
});
app.listen(4000, () => {
    console.log("✅ API server avviato su http://localhost:4000");
});
