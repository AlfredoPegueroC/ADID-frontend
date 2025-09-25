"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";

import Notification from "@components/Notification";
import { fetchUniversidades } from "@api/universidadService";
import { fetchFacultades } from "@api/facultadService";
import { fetchEscuelas } from "@api/escuelaService";

export default function RegisterPage() {
  const router = useRouter();

  const [universidades, setUniversidades] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [escuelas, setEscuelas] = useState([]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
    is_staff: false,
    groups: [],
    profile: {
      universidad: null,
      facultad: null,
      escuela: null,
    },
  });

  const [message, setMessage] = useState("");

  // --- Cargar universidades ---
  const cargarUniversidades = async (search = "", page = 1) => {
    try {
      const token = localStorage.getItem("accessToken") || "";
      const { results } = await fetchUniversidades(page, search, 10, token);
      setUniversidades(
        results.map((u) => ({ value: u.UniversidadID, label: u.UniversidadNombre }))
      );
    } catch (error) {
      console.error(error);
      Notification.alertError("No se pudieron cargar las universidades");
    }
  };

  // --- Cargar facultades ---
  const cargarFacultades = async (search = "", page = 1) => {
    try {
      const token = localStorage.getItem("accessToken") || "";
      const { results } = await fetchFacultades(page, search, 10, token);
      setFacultades(
        results.map((f) => ({ value: f.FacultadID, label: f.FacultadNombre }))
      );
    } catch (error) {
      console.error(error);
      Notification.alertError("No se pudieron cargar las facultades");
    }
  };

  // --- Cargar escuelas ---
  const cargarEscuelas = async (search = "", page = 1) => {
    try {
      const token = localStorage.getItem("accessToken") || "";
      const { results } = await fetchEscuelas(page, search, 10, token);
      setEscuelas(
        results.map((e) => ({ value: e.EscuelaId, label: e.EscuelaNombre }))
      );
    } catch (error) {
      console.error(error);
      Notification.alertError("No se pudieron cargar las escuelas");
    }
  };

  useEffect(() => {
    cargarUniversidades();
    cargarFacultades();
    cargarEscuelas();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (name === "role") {
      // Actualizamos is_staff y groups según el rol
      const isAdmin = value === "admin";
      setFormData((prev) => ({
        ...prev,
        is_staff: isAdmin,
        groups: [value],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? e.target.checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("❌ Las contraseñas no coinciden");
      return;
    }

    setMessage("Registrando...");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}api/usuarios/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          password: formData.password,
          is_staff: formData.is_staff,
          groups: formData.groups,
          profile: {
            universidad: formData.profile.universidad?.value || null,
            facultad: formData.profile.facultad?.value || null,
            escuela: formData.profile.escuela?.value || null,
          },
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ Usuario ${data.username} registrado`);
        setFormData({
          username: "",
          email: "",
          first_name: "",
          last_name: "",
          password: "",
          confirmPassword: "",
          is_staff: false,
          groups: [],
          profile: { universidad: null, facultad: null, escuela: null },
        });
      } else {
        setMessage(`❌ Error: ${JSON.stringify(data)}`);
      }
    } catch (err) {
      setMessage("❌ Error al conectar con el servidor");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4">Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        {/* Campos de usuario */}
        <div className="mb-3">
          <label>Nombre de usuario</label>
          <input
            className="form-control"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Correo</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Nombre</label>
          <input
            className="form-control"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Apellido</label>
          <input
            className="form-control"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Contraseña</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Confirmar Contraseña</label>
          <input
            type="password"
            className="form-control"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {/* Select de Rol */}
        <div className="mb-3">
          <label>Rol</label>
          <select
            className="form-select"
            name="role"
            value={formData.is_staff}
            onChange={handleChange}
          >
            <option value="solo_lectura">Solo lectura</option>
            <option value="usuario">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        {/* Campos de Profile */}
        <div className="mb-3">
          <label>Universidad</label>
          <Select
            options={universidades}
            value={formData.profile.universidad}
            onChange={(opt) =>
              setFormData((prev) => ({
                ...prev,
                profile: { ...prev.profile, universidad: opt },
              }))
            }
            placeholder="Seleccione universidad"
            isClearable
          />
        </div>

        <div className="mb-3">
          <label>Facultad</label>
          <Select
            options={facultades}
            value={formData.profile.facultad}
            onChange={(opt) =>
              setFormData((prev) => ({
                ...prev,
                profile: { ...prev.profile, facultad: opt },
              }))
            }
            placeholder="Seleccione facultad"
            isClearable
          />
        </div>

        <div className="mb-3">
          <label>Escuela</label>
          <Select
            options={escuelas}
            value={formData.profile.escuela}
            onChange={(opt) =>
              setFormData((prev) => ({
                ...prev,
                profile: { ...prev.profile, escuela: opt },
              }))
            }
            placeholder="Seleccione escuela"
            isClearable
          />
        </div>

        <button className="btn btn-primary w-100" type="submit">
          Registrar
        </button>
      </form>

      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}
