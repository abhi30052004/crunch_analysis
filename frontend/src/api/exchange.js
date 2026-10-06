const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export async function getExchangeStatus() {
  const res = await fetch(`${API_BASE_URL}/api/exchange/status`);
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

export async function getExchangeBalance() {
  const res = await fetch(`${API_BASE_URL}/api/exchange/balance`);
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

export async function getExchangeOrders() {
  const res = await fetch(`${API_BASE_URL}/api/exchange/orders`);
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

export async function placeExchangeOrder(order) {
  const res = await fetch(`${API_BASE_URL}/api/exchange/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  });
  if (!res.ok) throw new Error("Failed to place order");
  return res.json();
}

export async function getAutomationConfig() {
  const res = await fetch(`${API_BASE_URL}/api/automation/config`);
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

export async function updateAutomationConfig(config) {
  const res = await fetch(`${API_BASE_URL}/api/automation/config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  });
  if (!res.ok) throw new Error("Failed");
  return res.json();
}
