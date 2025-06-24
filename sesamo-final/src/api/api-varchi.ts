let accessTokenCache: {
  token: string | null;
  expiresAt: number | null;
} = { token: null, expiresAt: null };

const CONFIG = {
  tokenUrl: "https://gc2.cedac102.com/auth/realms/cedac102/protocol/openid-connect/token",
  clientId: "SlyHeDN3h0",
  clientSecret: "xPqbZ7iFUWkDh42qCz0bZ3zn4bpeLY",
  username: "fabrizio.togni@studioaquattro.it",
  password: "8Wq5SPEa",
  gateBaseUrl: "https://gc2.cedac102.com/gate-control-server/v1"
};

// 🔐 Ottieni token OAuth2
export async function getAccessToken(): Promise<string> {
  const now = Date.now();

  if (accessTokenCache.token && accessTokenCache.expiresAt && now < accessTokenCache.expiresAt) {
    return accessTokenCache.token;
  }

  const params = new URLSearchParams();
  params.append("grant_type", "password");
  params.append("client_id", CONFIG.clientId);
  params.append("client_secret", CONFIG.clientSecret);
  params.append("username", CONFIG.username);
  params.append("password", CONFIG.password);

  const response = await fetch(CONFIG.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params
  });

  if (!response.ok) {
    throw new Error("Autenticazione fallita: " + response.statusText);
  }

  const data = await response.json();
  accessTokenCache.token = data.access_token;
  accessTokenCache.expiresAt = now + data.expires_in * 1000;
  return data.access_token;
}

// 🚪 Attiva un varco
export async function openVarco(mac_gateway: string, device_id: string): Promise<boolean> {
  const token = await getAccessToken();

  const url = `${CONFIG.gateBaseUrl}/gateways/${mac_gateway}/devices/${device_id}/activate`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    }
  });

  if (response.ok) {
    return true;
  } else {
    const err = await response.text();
    console.error("Errore apertura varco:", err);
    return false;
  }
}