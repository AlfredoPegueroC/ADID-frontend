"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Styles from "@styles/login.module.css";
import Image from 'next/image';
import Notification from "@components/Notification";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      router.push("/");
    }
  }, [router]);

  const handleLogin = (e) => {
    e.preventDefault();

    const fakeUser = {
      username: username || "admin",
      groups: ["admin"]
    };

    localStorage.setItem("accessToken", "fake-token");
    localStorage.setItem("refreshToken", "fake-refresh");
    localStorage.setItem("user", JSON.stringify(fakeUser));

    Notification.alertLogin("Modo desarrollo: sesión simulada.");
    router.push("/admin");
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
