async function fetchWithRefresh(url, options = {}) {
  let accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  // Aseguramos que headers existe
  options.headers = options.headers || {};

  // Agrega el access token al header Authorization
  options.headers.Authorization = `Bearer ${accessToken}`;

  // Hace la petición inicial
  let response = await fetch(url, options);

  if (response.status === 401 && refreshToken) {
    // Token expirado, intentamos renovar
    const refreshResponse = await fetch("/api/auth/refresh-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (refreshResponse.ok) {
      const data = await refreshResponse.json();

      // Guardamos el nuevo access token
      localStorage.setItem("accessToken", data.accessToken);

      // Reintentamos la petición original con el token renovado
      options.headers.Authorization = `Bearer ${data.accessToken}`;
      response = await fetch(url, options);
    } else {
      // El refresh token expiró o es inválido: logout forzado
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login"; // redirige a login
      return;
    }
  }

  return response;
}
