"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Select from "react-select";
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
          fetch(`${API}universidades`),
          fetch(`${API}tipodocentes`),
          fetch(`${API}categoriadocentes`),
        ]);
        const data = await Promise.all(responses.map((res) => res.json()));

        setUniversidades(
          (data[0].results || data[0]).map((u) => ({
            value: u.UniversidadID,
            label: u.UniversidadNombre,
          }))
        );
        setTiposDocente(
          (data[1].results || data[1]).map((t) => ({
            value: t.TipoDocenteID,
            label: t.TipoDocenteDescripcion,
          }))
        );
        setCategoriasDocente(
          (data[2].results || data[2]).map((c) => ({
            value: c.CategoriaID,
            label: c.CategoriaNombre,
          }))
        );
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
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (selected, { name }) => {
    setFormData((prevData) => ({ ...prevData, [name]: selected?.value || "" }));
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
        console.error(errorData);
      }
    } catch (error) {
      Notification.alertError("Error al conectar con la API: " + error.message);
    }
  };

  if (isLoading) return <div>Cargando datos...</div>;

  return (
    <div className={Styles.container}>
      <form onSubmit={handleSubmit} className={Styles.form}>
        <h1 className={Styles.title}>{title}</h1>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteCodigo">Código:</label>
          <input type="text" name="DocenteCodigo" placeholder="Ej. DOC001" value={formData.DocenteCodigo} onChange={handleChange} required />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteNombre">Nombre:</label>
          <input type="text" name="DocenteNombre" placeholder="Nombre del docente" value={formData.DocenteNombre} onChange={handleChange} required />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteApellido">Apellido:</label>
          <input type="text" name="DocenteApellido" placeholder="Apellido del docente" value={formData.DocenteApellido} onChange={handleChange} required />
        </div>

        <div className={Styles.name_group}>
          <label>Sexo:</label>
          <select name="DocenteSexo" value={formData.DocenteSexo} onChange={handleChange} required>
            <option value="">-- Seleccione el sexo --</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
        </div>

        <div className={Styles.name_group}>
          <label>Estado Civil:</label>
          <select name="DocenteEstadoCivil" value={formData.DocenteEstadoCivil} onChange={handleChange} required>
            <option value="">-- Seleccione estado civil --</option>
            <option value="Soltero">Soltero</option>
            <option value="Casado">Casado</option>
            <option value="Union Libre">Unión Libre</option>
            <option value="Viudo">Viudo</option>
          </select>
        </div>

        <div className={Styles.name_group}>
          <label>Tipo Identificación:</label>
          <select name="DocenteTipoIdentificacion" value={formData.DocenteTipoIdentificacion} onChange={handleChange} required>
            <option value="">-- Seleccione tipo de identificación --</option>
            <option value="Cédula">Cédula</option>
            <option value="Pasaporte">Pasaporte</option>
          </select>
        </div>

        <div className={Styles.name_group}>
          <label>Número Identificación:</label>
          <input type="text" name="DocenteNumeroIdentificacion" placeholder="Ej. 00123456789" value={formData.DocenteNumeroIdentificacion} onChange={handleChange} required />
        </div>

        <div className={Styles.name_group}>
          <label>Fecha Nacimiento:</label>
          <input type="date" name="DocenteFechaNacimiento" value={formData.DocenteFechaNacimiento} onChange={handleChange} />
        </div>

        <div className={Styles.name_group}>
          <label>Lugar Nacimiento:</label>
          <input type="text" name="DocenteLugarNacimiento" placeholder="Ej. Santo Domingo" value={formData.DocenteLugarNacimiento} onChange={handleChange} required />
        </div>

        <div className={Styles.name_group}>
          <label>Fecha Ingreso:</label>
          <input type="date" name="DocenteFechaIngreso" value={formData.DocenteFechaIngreso} onChange={handleChange} />
        </div>

        <div className={Styles.name_group}>
          <label>Nacionalidad:</label>
          <input type="text" name="DocenteNacionalidad" placeholder="Ej. Dominicana" value={formData.DocenteNacionalidad} onChange={handleChange} required />
        </div>

        <div className={Styles.name_group}>
          <label>Teléfono:</label>
          <input type="text" name="DocenteTelefono" placeholder="Ej. 8090000000" value={formData.DocenteTelefono} onChange={handleChange} required />
        </div>

        <div className={Styles.name_group}>
          <label>Correo Electrónico:</label>
          <input type="email" name="DocenteCorreoElectronico" placeholder="Ej. docente@email.com" value={formData.DocenteCorreoElectronico} onChange={handleChange} required />
        </div>

        <div className={Styles.name_group}>
          <label>Dirección:</label>
          <input type="text" name="DocenteDireccion" placeholder="Dirección del docente" value={formData.DocenteDireccion} onChange={handleChange} required />
        </div>

        <div className={Styles.name_group}>
          <label>Estado:</label>
          <select name="DocenteEstado" value={formData.DocenteEstado} onChange={handleChange} required>
            <option value="">-- Seleccione el estado --</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className={Styles.name_group}>
          <label>Observaciones:</label>
          <textarea name="DocenteObservaciones" rows="3" placeholder="Observaciones adicionales" value={formData.DocenteObservaciones} onChange={handleChange} />
        </div>

        <div className={Styles.name_group}>
          <label>Universidad:</label>
          <Select
            name="Docente_UniversidadFK"
            options={universidades}
            placeholder="Seleccione una universidad"
            value={universidades.find((u) => u.value === formData.Docente_UniversidadFK)}
            onChange={handleSelectChange}
          />
        </div>

        <div className={Styles.name_group}>
          <label>Tipo Docente:</label>
          <Select
            name="Docente_TipoDocenteFK"
            options={tiposDocente}
            placeholder="Seleccione tipo de docente"
            value={tiposDocente.find((t) => t.value === formData.Docente_TipoDocenteFK)}
            onChange={handleSelectChange}
          />
        </div>

        <div className={Styles.name_group}>
          <label>Categoría Docente:</label>
          <Select
            name="Docente_CategoriaDocenteFK"
            options={categoriasDocente}
            placeholder="Seleccione categoría docente"
            value={categoriasDocente.find((c) => c.value === formData.Docente_CategoriaDocenteFK)}
            onChange={handleSelectChange}
          />
        </div>

        <div className={Styles.btn_group}>
          <button type="submit" className={Styles.btn}>Enviar</button>
        </div>
      </form>
    </div>
  );
}
