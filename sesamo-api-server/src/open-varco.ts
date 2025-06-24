import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

console.log("🔐 ENV Cedac:", {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  API_USERNAME: process.env.API_USERNAME,
  API_PASSWORD: process.env.API_PASSWORD,
});

let tokenCache: { token: string | null; expiresAt: number | null } = {
  token: null,
  expiresAt: null,
};

async function getAccessToken(): Promise<string> {
  const now = Date.now();

  if (tokenCache.token && tokenCache.expiresAt && now < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const tokenUrl = `https://gc2.cedac102.com/uaa/oauth/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=password&username=${encodeURIComponent(process.env.API_USERNAME!)}&password=${encodeURIComponent(process.env.API_PASSWORD!)}`;

  console.log("🔐 Token URL:", tokenUrl);

  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const debugText = await res.text();
  console.log("📡 Risposta token Cedac:", res.status, debugText);

  if (!res.ok) {
    console.error("❌ Errore autenticazione Cedac:", res.status, debugText);
    throw new Error("Errore autenticazione");
  }

  const data = JSON.parse(debugText);
  tokenCache.token = data.access_token;
  tokenCache.expiresAt = now + data.expires_in * 1000;
  return data.access_token;
}

router.post("/api/open-varco", async (req, res) => {
  try {
    const { mac_gateway, device_id } = req.body;

    if (!mac_gateway || !device_id) {
      return res.status(400).json({ error: "Parametri mancanti" });
    }

    const token = await getAccessToken();

    const activateUrl = `https://gc2.cedac102.com/gate-control-server/v1/gateways/${mac_gateway}/devices/${device_id}/activate`;

    console.log("📤 Attivazione varco:", {
      activateUrl,
      token: token.substring(0, 10) + "...",
    });

    const activateRes = await fetch(activateUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const resultText = await activateRes.text();

    if (!activateRes.ok) {
      console.error("🚫 Errore attivazione varco:", activateRes.status, resultText);
      return res.status(500).json({ error: "Errore attivazione varco", details: resultText });
    }

    console.log("✅ Attivazione varco riuscita");
    return res.json({ success: true, response: resultText });
  } catch (err) {
    console.error("❌ Errore open-varco:", err);
    res.status(500).json({ error: "Errore interno" });
  }
});

export default router;
