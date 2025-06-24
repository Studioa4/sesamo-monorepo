import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

let tokenCache: { token: string | null; expiresAt: number | null } = {
  token: null,
  expiresAt: null,
};

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (tokenCache.token && tokenCache.expiresAt && now < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const params = new URLSearchParams();
  params.append("grant_type", "password");
  params.append("client_id", process.env.CLIENT_ID!);
  params.append("client_secret", process.env.CLIENT_SECRET!);
  params.append("username", process.env.API_USERNAME!);
  params.append("password", process.env.API_PASSWORD!);

  const res = await fetch("https://gc2.cedac102.com/auth/realms/cedac102/protocol/openid-connect/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  if (!res.ok) throw new Error("Errore autenticazione");
  const data = await res.json();
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

    const activateRes = await fetch(activateUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!activateRes.ok) {
      const errorText = await activateRes.text();
      return res.status(500).json({ error: "Errore attivazione", details: errorText });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("Errore open-varco:", err);
    res.status(500).json({ error: "Errore interno" });
  }
});

export default router;