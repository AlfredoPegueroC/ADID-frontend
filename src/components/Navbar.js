"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Style from "@styles/navbar.module.css";
import Notification from "./Notification";

export default function Navbar() {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_KEY;

  // 🔽 Simulación de datos de usuario
  const userName = "Rosmery Monegro";
  const userUsername = "100491456";

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      alert("No refresh token found. Redirecting to login.");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(`${API}api/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.ok) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        Notification.alertLogin('Saliendo...');
        router.push("/login");
      } else {
        const errorData = await response.json();
        if (errorData.error === "Invalid or expired token") {
          localStorage.clear();
          alert("Session expired. Redirecting to login.");
          router.push("/login");
        } else {
          alert(`Logout failed: ${errorData.error}`);
        }
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Error logging out.");
    }
  };

  return (
    <nav className={`${Style.navbar} navbar navbar-expand-lg`}>
      <div className="container-fluid d-flex mx-2.5 py-1">
        <img
          src="/LogoUASD.jpg"
          alt="Logo de la app"
          width="40"
          height="40"
          style={{ borderRadius: "10px", marginRight: "12px" }}
        />

        <Link className="navbar-brand text-white" href="/">
          Asignacion Docente - UASD
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto d-flex gap-3 align-items-center">
            <li className="nav-item">
              <Link
                className="nav-link active text-white fw-bold"
                aria-current="page"
                href="/"
              >
                Inicio
              </Link>
            </li>

            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle text-white fw-bold"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Mantenimientos
              </Link>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" href="/universidad">Universidad</Link></li>
                <li><Link className="dropdown-item" href="/campus">Campus</Link></li>
                <li><Link className="dropdown-item" href="/facultad">Facultad</Link></li>
                <li><Link className="dropdown-item" href="/escuela">Escuela</Link></li>
                <li><Link className="dropdown-item" href="/categoriadocente">Categoria docente</Link></li>
                <li><Link className="dropdown-item" href="/tipodocente">Tipo docente</Link></li>
                <li><Link className="dropdown-item" href="/docente">Docente</Link></li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle text-white fw-bold"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Listados
              </Link>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" href="/universidadList">Universidad</Link></li>
                <li><Link className="dropdown-item" href="/campusList">Campus</Link></li>
                <li><Link className="dropdown-item" href="/facultadList">Facultad</Link></li>
                <li><Link className="dropdown-item" href="/escuelaList">Escuela</Link></li>
                <li><Link className="dropdown-item" href="/categoriadocenteList">Categoria docente</Link></li>
                <li><Link className="dropdown-item" href="/tipodocenteList">Tipo docente</Link></li>
                <li><Link className="dropdown-item" href="/docenteList">Docente</Link></li>
                <li><Link className="dropdown-item" href="/periodoList">Periodo Academico</Link></li>
              </ul>
            </li>

           <li className="nav-item dropdown">
              <div
                className="d-flex align-items-center bg-light text-dark px-3 py-1 rounded-pill border border-primary shadow-sm user-info dropdown-toggle"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className="fw-semibold">{userName}</span>
                <span className="ms-2 text-muted" style={{ fontSize: "1rem" }}>
                  ({userUsername})
                </span>
              </div>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    Cerrar seccion
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
