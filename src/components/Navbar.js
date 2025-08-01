"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@contexts/AuthContext";
import Style from "@styles/navbar.module.css";
import Notification from "./Notification";

import { useQueryClient } from "@tanstack/react-query";
import { fetchUniversidades } from "@api/universidadService";
import { fetchFacultades } from "@api/facultadService";
import { fetchCampus } from "@api/campusService";
import { fetchEscuelas } from "@api/escuelaService";
import { fetchDocentes } from "@api/docenteService";

export default function Navbar() {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_KEY;
  const { user, refreshToken, logout } = useAuth();

  const queryClient = useQueryClient();
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const handlePrefetch = (key, fetchFn) => {
    queryClient.prefetchQuery({
      queryKey: [key],
      queryFn: fetchFn,
      staleTime: 1000 * 60 * 5, // 5 minutos
    });
  };

  const handleLogout = async () => {
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
        Notification.alertLogin("Saliendo...");
        logout();
        router.push("/login");
      } else {
        const errorData = await response.json();
        if (errorData.error === "Invalid or expired token") {
          logout();
          Notification.alertLogin("Sesión expirada. Redirigiendo al login.");
          router.push("/login");
        } else {
          Notification.alertLogin(`Error al cerrar sesión: ${errorData.error}`);
        }
      }
    } catch (error) {
      console.error("Logout error:", error);
      Notification.alertError("Error al cerrar sesión.");
    }
  };

  const userName = user ? `${user.first_name} ${user.last_name}`.trim() : "";
  const userUsername = user?.username || "";

  return (
    <nav className={`${Style.navbar} navbar navbar-expand-lg`}>
      <div className={`${Style.container}  container-fluid d-flex mx-2.5 py-1`}>
        <img
          src="/LogoUASD.jpg"
          alt="Logo de la app"
          width="40"
          height="40"
          style={{ borderRadius: "10px", marginRight: "12px" }}
        />

        <Link className="navbar-brand text-white" href="/">
          SYSAD - UASD
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
              <Link className="nav-link active text-white fw-bold" href="/">
                Inicio
              </Link>
            </li>

            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle text-white fw-bold"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
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
              >
                Listados
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link
                    className="dropdown-item"
                    href="/universidadList"
                    onMouseEnter={() =>
                      handlePrefetch("universidades", () =>
                        fetchUniversidades(1, "", 10, token)
                      )
                    }
                  >
                    Universidad
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    href="/campusList"
                    onMouseEnter={() =>
                      handlePrefetch("campus", () =>
                        fetchCampus(1, "", 10, token)
                      )
                    }
                  >
                    Campus
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    href="/facultadList"
                    onMouseEnter={() =>
                      handlePrefetch("facultades", () =>
                        fetchFacultades(1, "", 10, token)
                      )
                    }
                  >
                    Facultad
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    href="/escuelaList"
                    onMouseEnter={() =>
                      handlePrefetch("escuelas", () =>
                        fetchEscuelas(1, "", 10, token)
                      )
                    }
                  >
                    Escuela
                  </Link>
                </li>
                <li><Link className="dropdown-item" href="/categoriadocenteList">Categoria docente</Link></li>
                <li><Link className="dropdown-item" href="/tipodocenteList">Tipo docente</Link></li>
                <li>
                  <Link
                    className="dropdown-item"
                    href="/docenteList"
                    onMouseEnter={() =>
                      handlePrefetch("docentes", () =>
                        fetchDocentes(1, "", 10, token)
                      )
                    }
                  >
                    Docente
                  </Link>
                </li>
                <li><Link className="dropdown-item" href="/periodoList">Periodo Academico</Link></li>
              </ul>
            </li>

            {user && (
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
                  {user.groups?.includes("admin") && (
                    <li>
                      <Link className="dropdown-item" href="/admin">
                        Panel Admin
                      </Link>
                    </li>
                  )}
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
