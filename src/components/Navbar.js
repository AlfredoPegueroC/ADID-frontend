"use client"
import Link from "next/link"
// import style from "../navbar.module.css"

export default function Navbar(){
  return (
    <nav className="navbar">
      <Link href="/">Inicio</Link>
      <ul className="links">
        <li ><Link href="/login">Login</Link></li>

        <li ><Link href="/universidad">Universidad</Link></li>
        <li><Link href="/facultad">Facultad</Link></li>
        <li><Link href="/escuela">Escuela</Link></li>
        <li><Link href="/docente">Docente</Link></li>
        <li><Link href="/tipodocente">Tipo Docente</Link></li>
        <li><Link href="/categoriadocente">Categoria Docente</Link></li>
      </ul>

      <style jsx>{`
        .navbar{
          background: #fff;
          color: #383838;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 5rem; 
        }
        .links{
          display: flex;
          gap: 2rem;
          list-style-type: none;
        }
      `}
      </style>
    </nav>
  )


}
