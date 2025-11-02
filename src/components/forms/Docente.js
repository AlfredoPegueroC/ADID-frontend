"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Select from "react-select";
import Notification from "../Notification";
import Styles from "@styles/form.module.css";

import { fetchUniversidades } from "@api/universidadService";
import { fetchTipoDocentes } from "@api/tipoDocenteService";
import { fetchCategorias } from "@api/categoriaService";

export default function DocenteForm({ title }) {
  const router = useRouter();

  const [universidades, setUniversidades] = useState([]);
  const [tiposDocente, setTiposDocente] = useState([]);
  const [categoriasDocente, setCategoriasDocente] = useState([]);

  const [loadingUniversidades, setLoadingUniversidades] = useState(false);
  const [loadingTipos, setLoadingTipos] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(false);

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
    Docente_UniversidadFK: null,
    Docente_TipoDocenteFK: null,
    Docente_CategoriaDocenteFK: null,
  });

  const cargarUniversidades = async (search = "") => {
    setLoadingUniversidades(true);
    try {
      const token = localStorage.getItem("accessToken") || "";
      const { results } = await fetchUniversidades(1, search, 10, token);
      const opciones = results.map((u) => ({
        value: u.UniversidadID,
        label: u.UniversidadNombre,
      }));
      setUniversidades(opciones);
    } catch (error) {
      Notification.alertError("Error al cargar universidades");
      console.error(error);
    } finally {
      setLoadingUniversidades(false);
    }
  };

  const cargarTiposDocente = async (search = "") => {
    setLoadingTipos(true);
    try {
      const token = localStorage.getItem("accessToken") || "";
      const { results } = await fetchTipoDocentes(1, search, 10, token);
      const opciones = results.map((t) => ({
        value: t.TipoDocenteID,
        label: t.TipoDocenteDescripcion,
      }));
      setTiposDocente(opciones);
    } catch (error) {
      Notification.alertError("Error al cargar tipos de docente");
      console.error(error);
    } finally {
      setLoadingTipos(false);
    }
  };

  const cargarCategoriasDocente = async (search = "") => {
    setLoadingCategorias(true);
    try {
      const token = localStorage.getItem("accessToken") || "";
      const { results } = await fetchCategorias(1, search, 10, token);
      const opciones = results.map((c) => ({
        value: c.CategoriaID,
        label: c.CategoriaNombre,
      }));
      setCategoriasDocente(opciones);
    } catch (error) {
      Notification.alertError("Error al cargar categorías de docente");
      console.error(error);
    } finally {
      setLoadingCategorias(false);
    }
  };

  useEffect(() => {
    cargarUniversidades();
    cargarTiposDocente();
    cargarCategoriasDocente();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption, actionMeta) => {
    const { name } = actionMeta;
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption || null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");

    const payload = {
      ...formData,
      Docente_UniversidadFK: formData.Docente_UniversidadFK?.value || null,
      Docente_TipoDocenteFK: formData.Docente_TipoDocenteFK?.value || null,
      Docente_CategoriaDocenteFK:
        formData.Docente_CategoriaDocenteFK?.value || null,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_KEY}api/docente/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        Notification.alertSuccess("Docente creado con éxito");
        router.push("/docenteList");
      } else {
        const error = await response.json();
        Notification.alertError("Error al crear el docente.");
        console.error(error);
      }
    } catch (error) {
      Notification.alertError("Error de conexión: " + error.message);
    }
  };

  return (
    <div className={Styles.container}>
      <form onSubmit={handleSubmit} className={Styles.form}>
        <h1 className={Styles.title}>{title}</h1>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteCodigo">Código:</label>
          <input
            type="text"
            name="DocenteCodigo"
            id="DocenteCodigo"
            placeholder="Ej. DOC001"
            value={formData.DocenteCodigo}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteNombre">Nombre:</label>
          <input
            type="text"
            name="DocenteNombre"
            id="DocenteNombre"
            placeholder="Nombre del docente"
            value={formData.DocenteNombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteApellido">Apellido:</label>
          <input
            type="text"
            name="DocenteApellido"
            id="DocenteApellido"
            placeholder="Apellido del docente"
            value={formData.DocenteApellido}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteSexo">Sexo:</label>
          <select
            name="DocenteSexo"
            id="DocenteSexo"
            value={formData.DocenteSexo}
            onChange={handleChange}
            required
          >
            <option value="">-- Seleccione el sexo --</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteEstadoCivil">Estado Civil:</label>
          <select
            name="DocenteEstadoCivil"
            id="DocenteEstadoCivil"
            value={formData.DocenteEstadoCivil}
            onChange={handleChange}
            required
          >
            <option value="">-- Seleccione estado civil --</option>
            <option value="Soltero">Soltero</option>
            <option value="Casado">Casado</option>
            <option value="Union Libre">Unión Libre</option>
            <option value="Viudo">Viudo</option>
          </select>
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteTipoIdentificacion">
            Tipo Identificación:
          </label>
          <select
            name="DocenteTipoIdentificacion"
            id="DocenteTipoIdentificacion"
            value={formData.DocenteTipoIdentificacion}
            onChange={handleChange}
            required
          >
            <option value="">-- Seleccione tipo de identificación --</option>
            <option value="Cédula">Cédula</option>
            <option value="Pasaporte">Pasaporte</option>
          </select>
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteNumeroIdentificacion">
            Número Identificación:
          </label>
          <input
            type="text"
            name="DocenteNumeroIdentificacion"
            id="DocenteNumeroIdentificacion"
            placeholder="Ej. 00123456789"
            value={formData.DocenteNumeroIdentificacion}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteFechaNacimiento">Fecha Nacimiento:</label>
          <input
            type="date"
            name="DocenteFechaNacimiento"
            id="DocenteFechaNacimiento"
            value={formData.DocenteFechaNacimiento}
            onChange={handleChange}
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteLugarNacimiento">Lugar Nacimiento:</label>
          <input
            type="text"
            name="DocenteLugarNacimiento"
            id="DocenteLugarNacimiento"
            placeholder="Ej. Santo Domingo"
            value={formData.DocenteLugarNacimiento}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteFechaIngreso">Fecha Ingreso:</label>
          <input
            type="date"
            name="DocenteFechaIngreso"
            id="DocenteFechaIngreso"
            value={formData.DocenteFechaIngreso}
            onChange={handleChange}
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteNacionalidad">Nacionalidad:</label>
          <input
            type="text"
            name="DocenteNacionalidad"
            id="DocenteNacionalidad"
            placeholder="Ej. Dominicana"
            value={formData.DocenteNacionalidad}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteTelefono">Teléfono:</label>
          <input
            type="text"
            name="DocenteTelefono"
            id="DocenteTelefono"
            placeholder="Ej. 8090000000"
            value={formData.DocenteTelefono}
            onChange={handleChange}
            required
          />
        </div>

         <div className={Styles.name_group}>
          <label htmlFor="DocenteCelular">Teléfono:</label>
          <input
            type="text"
            name="DocenteCelular"
            id="DocenteCelular"
            placeholder="Ej. 8090000000"
            value={formData.DocenteCelular}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteCorreoElectronico">Correo Electrónico:</label>
          <input
            type="email"
            name="DocenteCorreoElectronico"
            id="DocenteCorreoElectronico"
            placeholder="Ej. docente@email.com"
            value={formData.DocenteCorreoElectronico}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteDireccion">Dirección:</label>
          <input
            type="text"
            name="DocenteDireccion"
            id="DocenteDireccion"
            placeholder="Dirección del docente"
            value={formData.DocenteDireccion}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteEstado">Estado:</label>
          <select
            name="DocenteEstado"
            id="DocenteEstado"
            value={formData.DocenteEstado}
            onChange={handleChange}
            required
          >
            <option value="">-- Seleccione el estado --</option>
            <option value="Activo">Activo</option>
            <option value="Licencia">Licencia</option>
            <option value="Sabático">Sabático</option>
            <option value="Jubilado">Jubilado</option>
            <option value="Contratado">Contratado</option>
            <option value="Desmontado">Desmontado</option>

          </select>
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="DocenteObservaciones">Observaciones:</label>
          <textarea
            name="DocenteObservaciones"
            id="DocenteObservaciones"
            rows="3"
            placeholder="Observaciones adicionales"
            value={formData.DocenteObservaciones}
            onChange={handleChange}
          />
        </div>

        <div className={Styles.name_group}>
          <label>Universidad:</label>
          <Select
            name="Docente_UniversidadFK"
            options={universidades}
            value={formData.Docente_UniversidadFK}
            onChange={handleSelectChange}
            onInputChange={(inputValue) => {
              if (typeof inputValue === "string") {
                cargarUniversidades(inputValue.replace(/\s/g, ""));
              }
            }}
            placeholder="Seleccione una universidad"
            isClearable
            isLoading={loadingUniversidades}
          />
        </div>

        <div className={Styles.name_group}>
          <label>Tipo Docente:</label>
          <Select
            name="Docente_TipoDocenteFK"
            options={tiposDocente}
            value={formData.Docente_TipoDocenteFK}
            onChange={handleSelectChange}
            onInputChange={(inputValue) => {
              if (typeof inputValue === "string") {
                cargarTiposDocente(inputValue.replace(/\s/g, ""));
              }
            }}
            placeholder="Seleccione tipo de docente"
            isClearable
            isLoading={loadingTipos}
          />
        </div>

        <div className={Styles.name_group}>
          <label>Categoría Docente:</label>
          <Select
            name="Docente_CategoriaDocenteFK"
            options={categoriasDocente}
            value={formData.Docente_CategoriaDocenteFK}
            onChange={handleSelectChange}
            onInputChange={(inputValue) => {
              if (typeof inputValue === "string") {
                cargarCategoriasDocente(inputValue.replace(/\s/g, ""));
              }
            }}
            placeholder="Seleccione categoría docente"
            isClearable
            isLoading={loadingCategorias}
          />
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
