
export async function fetchWithAuth(url, options = {}) {
  const accessToken = localStorage.getItem("accessToken");

  const headers = {
    ...options.headers,
    Authorization: accessToken ? `Bearer ${accessToken}` : "",
    "Content-Type": "application/json",
  };

  const response = await fetch(url, { ...options, headers });

  // Si el token expiró
  if (response.status === 401) {
    // Emitimos un evento global de logout
    window.dispatchEvent(new Event("tokenExpired"));
  }

  return response;
}
