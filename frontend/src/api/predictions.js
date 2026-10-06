const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://crunch-analysis.onrender.com";

export async function getPredictions() {
  const response = await fetch(`${API_BASE_URL}/api/predictions`);

  if (!response.ok) {
    throw new Error("Failed to fetch predictions");
  }

  return response.json();
}
