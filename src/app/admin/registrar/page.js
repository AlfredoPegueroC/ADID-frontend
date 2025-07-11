"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    is_staff: false,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Registrando...");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_KEY}api/registro`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
           },
          body: JSON.stringify(formData),
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
          is_staff: false,
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
        <div className="form-check mb-3">
         <input className="form-check-input" type="checkbox" name="is_staff" checked={formData.is_staff} onChange={handleChange} />
          <label className="form-check-label" htmlFor="is_staff">
            ¿Registrar como administrador?
          </label>
        </div>
        <button className="btn btn-primary w-100" type="submit">
          Registrar
        </button>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}
