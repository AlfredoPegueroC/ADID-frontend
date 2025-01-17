"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{
        backgroundColor: "rgba(19, 98, 209, 0.9)",
        borderRadius: "4px",
        height: "70px",
        fontSize: "18.5px",
        fontWeight: "bold",
        margin: "0.5px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        marginBottom: "2.5rem",
        justifyContent: "flex-start",
        textAlign: "left",
      }}
    >
      <div
        className="container-fluid mx-5 py-1"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        {/* Aquí está el logo */}
        <a
          className="navbar-brand d-flex align-items-center"
          href="/"
          style={{
            color: "white",
            fontSize: "24px",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Imagen del logo */}
          <img
            src="/LOGO-UASD-e1651335718694.png"
            alt="Logo"
            style={{ height: "50px", marginLeft: "0px", paddingRight: "10px" }}
          />
          {/* Texto de la marca */}
          Asignación Docente - UASD
        </a>
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
          <ul className="navbar-nav ms-auto" style={{ display: "flex", alignItems: "center" }}>
            <li className="nav-item mx-3">
              <Link
                className="nav-link active"
                aria-current="page"
                href="/"
                style={{
                  color: "white",
                  textDecoration: "none",
                  padding: "10px",
                  borderRadius: "4px",
                }}
              >
                Inicio
              </Link>
            </li>
            {/* Mantenimiento Dropdown */}
            <li className="nav-item dropdown mx-3">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{
                  color: "white",
                  textDecoration: "none",
                  padding: "10px",
                  borderRadius: "4px",
                }}
              >
                Mantenimientos
              </a>
              <ul className="dropdown-menu" style={{
                    backgroundColor:"#0da6fffa",
                    padding: "10px",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "bold",
                    border: "none",
                    borderRadius: "1rem",
                    marginTop: "1rem",
              }}>
                <li>
                  <Link className="dropdown-item" href="/universidad">
                    Universidad
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" href="/facultad">
                    Facultad
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" href="/escuela">
                    Escuela
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" href="/categoriadocente">
                    Categoria docente
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" href="/tipodocente">
                    Tipo docente
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" href="/docente">
                    Docente
                  </Link>
                </li>
              </ul>
            </li>
            {/* Listados Dropdown */}
            <li className="nav-item dropdown mx-3">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{
                  color: "white",
                  textDecoration: "none",
                  padding: "10px",
                  borderRadius: "4px",
                }}
              >
                Listados
              </a>
              <ul className="dropdown-menu" style={{
                    backgroundColor:"#0da6fffa",
                    padding: "10px",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "bold",
                    border: "none",
                    borderRadius: "1rem",
                    marginTop: "1rem",
              }}>
                <li>
                  <Link className="dropdown-item" href="/universidadList">
                    Universidad
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" href="/facultadList">
                    Facultad
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" href="/escuelaList">
                    Escuela
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" href="/categoriadocenteList">
                    Categoria docente
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" href="/tipodocenteList">
                    Tipo docente
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" href="/docenteList">
                    Docente
                  </Link>
                </li>
              </ul>
            </li>
            {/* Botón de Configuración con opciones desplegables */}
            <li className="nav-item dropdown mx-3">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{
                  color: "white",
                  textDecoration: "none",
                  padding: "10px",
                  borderRadius: "4px",
                }}
              >
                Configuración
              </a>
              <ul className="dropdown-menu" style={{
                    backgroundColor:"#0da6fffa",
                    padding: "10px",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "bold",
                    border: "none",
                    borderRadius: "1rem",
                    marginTop: "1rem",
              }}>
                <li>
                  <Link className="dropdown-item" href="/config/cambiar-contraseña">
                    Cambiar contraseña
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" href="/config/idioma">
                    Preferencias de idioma
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" href="/config/tema">
                    Tema oscuro
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" href="/config/notificaciones">
                    Notificaciones
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
