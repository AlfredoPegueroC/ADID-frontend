"use client"
import Link from "next/link"

// import style from "../navbar.module.css"

export default function Navbar(){
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
  <div className="container-fluid mx-5 py-1">
    <a className="navbar-brand" href="/">Navbar</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNavDropdown">
      <ul className="navbar-nav ms-auto">
        <li className="nav-item">
          <Link className="nav-link active" aria-current="page" href="/">Home</Link>
        </li>
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Matenimientos
          </a>
          <ul className="dropdown-menu">
            <li><Link className="dropdown-item" href="/universidad">Universidad</Link></li>
            <li><Link className="dropdown-item" href="/facultad">Facultad</Link></li>
            <li><Link className="dropdown-item" href="/escuela">Escuela</Link></li>
            <li><Link className="dropdown-item" href="/categoriadocente">Categoria docente</Link></li>
            <li><Link className="dropdown-item" href="/tipodocente">Tipo docente</Link></li>
            <li><Link className="dropdown-item" href="/docente">Docente</Link></li>
          </ul>
        </li>
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Listados
          </a>
          <ul className="dropdown-menu">
            <li><Link className="dropdown-item" href="/universidadList">Universidad</Link></li>
            <li><Link className="dropdown-item" href="/facultadList">Facultad</Link></li>
            <li><Link className="dropdown-item" href="/escuelaList">Escuela</Link></li>
            <li><Link className="dropdown-item" href="/categoriadocenteList">Categoria docente</Link></li>
            <li><Link className="dropdown-item" href="/tipodocenteList">Tipo docente</Link></li>
            <li><Link className="dropdown-item" href="/docenteList">Docente</Link></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>
  )


}
