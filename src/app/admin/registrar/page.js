"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
    is_staff: false,
    groups: [],
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (name === "role") {
      const isAdmin = value === "admin";
      setFormData((prev) => ({
        ...prev,
        is_staff: isAdmin,
        groups: [isAdmin ? "admin" : "usuario"], // Admin = grupo "admin", Usuario = grupo "usuario"
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_KEY}api/usuarios/`,
        {
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
          }),
        }
      );

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
        <div className="mb-3">
          <label className="form-label">Nombre de usuario</label>
          <input
            className="form-control"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Correo</label>
          <input
            className="form-control"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            className="form-control"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Apellido</label>
          <input
            className="form-control"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            className="form-control"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Confirmar Contraseña</label>
          <input
            className="form-control"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Rol</label>
          <select
            className="form-select"
            name="role"
            value={formData.is_staff ? "admin" : "usuario"}
            onChange={handleChange}
          >
            <option value="usuario">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <button className="btn btn-primary w-100" type="submit">
          Registrar
        </button>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}
