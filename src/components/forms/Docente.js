"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Notification from "../Notification";
import Styles from "@styles/form.module.css";

export default function DocenteForm({ title }) {
  const router = useRouter();
  const [universidades, setUniversidades] = useState([]);
  const [tiposDocente, setTiposDocente] = useState([]);
  const [categoriasDocente, setCategoriasDocente] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    DocenteCodigo: "",
    DocenteNombre: "",
    DocenteApellido: "",
    DocenteSexo: "",
    DocenteEstadoCivil: "",
    DocenteFechaNacimiento: "",
    DocenteLugarNacimiento: "",
    DocenteFechaIngreso: "",
    DocenteNacionalidad: "",
    DocenteTipoIdentificacion: "",
    DocenteNumeroIdentificacion: "",
    DocenteTelefono: "",
    DocenteCorreoElectronico: "",
    DocenteDireccion: "",
    DocenteEstado: "",
    DocenteObservaciones: "",
    Docente_UniversidadFK: "",
    Docente_TipoDocenteFK: "",
    Docente_CategoriaDocenteFK: "",
  });

  const API = process.env.NEXT_PUBLIC_API_KEY;

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const responses = await Promise.all([
          fetch(`${API}api/universidad`),
          fetch(`${API}api/tipodocente`),
          fetch(`${API}api/categoriaDocente`),
        ]);
        const data = await Promise.all(responses.map((res) => res.json()));

        setUniversidades(data[0].results);
        setTiposDocente(data[1].results);
        setCategoriasDocente(data[2].results);
      } catch (error) {
        console.error("Error fetching data:", error);
        Notification.alertError("Error al cargar los datos, por favor intenta de nuevo.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API}api/docente/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          DocenteCodigo: "",
          DocenteNombre: "",
          DocenteApellido: "",
          DocenteSexo: "",
          DocenteEstadoCivil: "",
          DocenteFechaNacimiento: "",
          DocenteLugarNacimiento: "",
          DocenteFechaIngreso: "",
          DocenteNacionalidad: "",
          DocenteTipoIdentificacion: "",
          DocenteNumeroIdentificacion: "",
          DocenteTelefono: "",
          DocenteCorreoElectronico: "",
          DocenteDireccion: "",
          DocenteEstado: "",
          DocenteObservaciones: "",
          Docente_UniversidadFK: "",
          Docente_TipoDocenteFK: "",
          Docente_CategoriaDocenteFK: "",
        });

        router.push("/docenteList");
        Notification.alertSuccess("Docente creado con éxito");
      } else {
        const errorData = await response.json();
        Notification.alertError("Error al crear el docente");
      }
    } catch (error) {
      Notification.alertError("Error al conectar con la API: " + error.message);
    }
  };

  if (isLoading) {
    return <div>Cargando datos...</div>;
  }

  return (
    <div className={Styles.container}>
      <form onSubmit={handleSubmit} className={Styles.form}>
        <h1 className={Styles.title}>{title}</h1>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteCodigo">Código:</label>
          <input
            type="text"
            id="DocenteCodigo"
            name="DocenteCodigo"
            value={formData.DocenteCodigo}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteNombre">Nombre:</label>
          <input
            type="text"
            id="DocenteNombre"
            name="DocenteNombre"
            value={formData.DocenteNombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteApellido">Apellido:</label>
          <input
            type="text"
            id="DocenteApellido"
            name="DocenteApellido"
            value={formData.DocenteApellido}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteSexo">Sexo:</label>
          <select
            id="DocenteSexo"
            name="DocenteSexo"
            value={formData.DocenteSexo}
            onChange={handleChange}
            required
          >
            <option value="" disabled>-- Seleccione el sexo --</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteEstadoCivil">Estado Civil:</label>
          <select
            id="DocenteEstadoCivil"
            name="DocenteEstadoCivil"
            value={formData.DocenteEstadoCivil}
            onChange={handleChange}
            required
          >
            <option value="" disabled>-- Seleccione el estado civil --</option>
            <option value="Soltero">Soltero</option>
            <option value="Casado">Casado</option>
            <option value="Union Libre">Unión Libre</option>
            <option value="Viudo">Viudo</option>
          </select>
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteTipoIdentificacion">Tipo de Identificación:</label>
          <select
            id="DocenteTipoIdentificacion"
            name="DocenteTipoIdentificacion"
            value={formData.DocenteTipoIdentificacion}
            onChange={handleChange}
            required
          >
            <option value="" disabled>-- Seleccione el tipo de identificación --</option>
            <option value="Cédula">Cédula</option>
            <option value="Pasaporte">Pasaporte</option>
          </select>
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteNumeroIdentificacion">Número de Identificación:</label>
          <input
            type="text"
            id="DocenteNumeroIdentificacion"
            name="DocenteNumeroIdentificacion"
            value={formData.DocenteNumeroIdentificacion}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteFechaNacimiento">Fecha de Nacimiento:</label>
          <input
            type="date"
            id="DocenteFechaNacimiento"
            name="DocenteFechaNacimiento"
            value={formData.DocenteFechaNacimiento}
            onChange={handleChange}
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteLugarNacimiento">Lugar de Nacimiento:</label>
          <input
            type="text"
            id="DocenteLugarNacimiento"
            name="DocenteLugarNacimiento"
            value={formData.DocenteLugarNacimiento}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteFechaIngreso">Fecha de Ingreso:</label>
          <input
            type="date"
            id="DocenteFechaIngreso"
            name="DocenteFechaIngreso"
            value={formData.DocenteFechaIngreso}
            onChange={handleChange}
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteNacionalidad">Nacionalidad:</label>
          <input
            type="text"
            id="DocenteNacionalidad"
            name="DocenteNacionalidad"
            value={formData.DocenteNacionalidad}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteTelefono">Teléfono:</label>
          <input
            type="text"
            id="DocenteTelefono"
            name="DocenteTelefono"
            value={formData.DocenteTelefono}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteCorreoElectronico">Correo Electrónico:</label>
          <input
            type="email"
            id="DocenteCorreoElectronico"
            name="DocenteCorreoElectronico"
            value={formData.DocenteCorreoElectronico}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteDireccion">Dirección:</label>
          <input
            type="text"
            id="DocenteDireccion"
            name="DocenteDireccion"
            value={formData.DocenteDireccion}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteEstado">Estado:</label>
          <select
            id="DocenteEstado"
            name="DocenteEstado"
            value={formData.DocenteEstado}
            onChange={handleChange}
            required
          >
            <option value="" disabled>-- Seleccione el estado --</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteObservaciones">Observaciones:</label>
          <textarea
            id="DocenteObservaciones"
            name="DocenteObservaciones"
            rows="3"
            value={formData.DocenteObservaciones}
            onChange={handleChange}
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="Docente_UniversidadFK">Universidad:</label>
          <select
            id="Docente_UniversidadFK"
            name="Docente_UniversidadFK"
            value={formData.Docente_UniversidadFK}
            onChange={handleChange}
            required
          >
            <option value="" disabled>-- Seleccione una Universidad --</option>
            {universidades.map((u) => (
              <option key={u.UniversidadID} value={u.UniversidadID}>
                {u.UniversidadNombre}
              </option>
            ))}
          </select>
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="Docente_TipoDocenteFK">Tipo Docente:</label>
          <select
            id="Docente_TipoDocenteFK"
            name="Docente_TipoDocenteFK"
            value={formData.Docente_TipoDocenteFK}
            onChange={handleChange}
            required
          >
            <option value="" disabled>-- Seleccione el Tipo de Docente --</option>
            {tiposDocente.map((tipo) => (
              <option key={tipo.TipoDocenteID} value={tipo.TipoDocenteID}>
                {tipo.TipoDocenteDescripcion}
              </option>
            ))}
          </select>
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="Docente_CategoriaDocenteFK">Categoría Docente:</label>
          <select
            id="Docente_CategoriaDocenteFK"
            name="Docente_CategoriaDocenteFK"
            value={formData.Docente_CategoriaDocenteFK}
            onChange={handleChange}
            required
          >
            <option value="" disabled>-- Seleccione la Categoría de Docente --</option>
            {categoriasDocente.map((categoria) => (
              <option key={categoria.CategoriaID} value={categoria.CategoriaID}>
                {categoria.CategoriaNombre}
              </option>
            ))}
          </select>
        </div>

        <div className={Styles.btn_group}>
          <button type="submit" className={Styles.btn}>
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}