"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Styles from "@styles/login.module.css";
import Image from "next/image";
import { useAuth } from "@contexts/AuthContext"; 
export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth(); 

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const API = process.env.NEXT_PUBLIC_API_KEY;

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      router.push("/");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${API}api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        let errorMessage = "Error al iniciar sesión";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }

      const { access, refresh, user } = await response.json();

      // Guardar en el contexto y en localStorage automáticamente
      login({ user, access, refresh });

      if (user.groups.includes("admin")) {
        router.push("/admin");
      } else {
        router.push("/");
      }

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={Styles.login_container}>
      <div className={Styles.login_box}>
        <div className={Styles.left_section}>
          <Image
            src="/images-Photoroom.png"
            alt="Logo de la Facultad de Ciencias"
            width={200}
            height={200}
          />
          <h2 className={Styles.separacion}>FACULTAD DE CIENCIAS UASD</h2>
        </div>
        <div className={Styles.right_section}>
          <h2>Iniciar Sesión</h2>
          <form className={Styles.form} onSubmit={handleLogin}>
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
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
