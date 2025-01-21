"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Styles from "@styles/login.module.css";


export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed. Please check your credentials.");
      }

      const data = await response.json();
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);

      alert("Login successful!");
      router.push("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={Styles.login_container}>
      <div className={Styles.login_box }>
        <div className={Styles.left_section}>
          <h2 className={Styles.separacion}>FACULTAD DE CIENCIAS UASD</h2>
        </div>
        <div className={Styles.right_section}>
          <h2>Iniciar Sesión</h2>
          <form className={Styles.form} onSubmit={handleLogin}>
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className={Styles.login_btn}>
              Iniciar Sesión
            </button>
            {error && <p className={Styles.error}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

