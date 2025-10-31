"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AsyncSelect from "react-select/async";
import Notification from "@components/Notification";
import withAuth from "@utils/withAuth";
import Styles from "@styles/form.module.css";

import { fetchUniversidades } from "@api/universidadService";
import { fetchTipoDocentes } from "@api/tipoDocenteService";
import { fetchCategorias } from "@api/categoriaService";

function DocenteEdit({ params }) {
  const router = useRouter();
  const { id } = params;
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const [docente, setDocente] = useState({
    DocenteCodigo: "",
    DocenteNombre: "",
    DocenteApellido: "",
    DocenteSexo: "",
    DocenteEstadoCivil: "",
    DocenteTipoIdentificacion: "",
    DocenteNumeroIdentificacion: "",
    DocenteFechaNacimiento: "",
    DocenteLugarNacimiento: "",
    DocenteFechaIngreso: "",
    DocenteNacionalidad: "",
    DocenteTelefono: "",
    DocenteCorreoElectronico: "",
    DocenteDireccion: "",
    DocenteEstado: "",
    DocenteObservaciones: "",
    Docente_UniversidadFK: "",
    Docente_TipoDocenteFK: "",
    Docente_CategoriaDocenteFK: "",
  });

  const [selectedUniversidad, setSelectedUniversidad] = useState(null);
  const [selectedTipoDocente, setSelectedTipoDocente] = useState(null);
  const [selectedCategoriaDocente, setSelectedCategoriaDocente] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Cargar datos docente y cargar selects con sus labels iniciales
  useEffect(() => {
    async function fetchDocente() {
      setLoading(true);
      const token = localStorage.getItem("accessToken") || "";
      try {
        const res = await fetch(`${API}api/docente/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al cargar docente");
        const data = await res.json();



        const universidadCodigo =
          typeof data.universidadCodigo === "object"
            ? data.universidadCodigo
            : data.universidadCodigo;

        const tipoDocenteCodigo =
          typeof data.tipoDocenteCodigo === "object"
            ? data.tipoDocenteCodigo
            : data.tipoDocenteCodigo;

        const categoriaDocenteCodigo =
          typeof data.categoriaDocenteCodigo === "object"
            ? data.categoriaDocenteCodigo
            : data.categoriaDocenteCodigo;

        setDocente({ ...data, universidadCodigo, tipoDocenteCodigo, categoriaDocenteCodigo });

         // Cargar Universidad seleccionada para mostrar label
        if (universidadCodigo) {
          // Obtener nombre universidad con fetch para mostrar label en select
          const resUni = await fetch(`${API}api/universidad/${universidadCodigo}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!resUni.ok) throw new Error("Universidad no encontrada");
          const dataUni = await resUni.json();

          setSelectedUniversidad({
            value: dataUni.UniversidadID,
            label: dataUni.UniversidadNombre || "Sin nombre",
          });
        } else {
          setSelectedUniversidad(null);
        }

        // Cargar label tipo docente
        if (tipoDocenteCodigo) {
          const resTipo = await fetch(`${API}api/tipodocente/${tipoDocenteCodigo}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (resTipo.ok) {
            const dataTipo = await resTipo.json();
            setSelectedTipoDocente({
              value: dataTipo.TipoDocenteID,
              label: dataTipo.TipoDocenteDescripcion || "Sin nombre",
            });
          }
        } else {
          setSelectedTipoDocente(null);
        }

        // Cargar label categoria docente
        if (categoriaDocenteCodigo) {
          const resCat = await fetch(`${API}api/categoriadocente/${categoriaDocenteCodigo}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (resCat.ok) {
            const dataCat = await resCat.json();
            setSelectedCategoriaDocente({
              value: dataCat.CategoriaID,
              label: dataCat.CategoriaNombre || "Sin nombre",
            });
          }
        } else {
          setSelectedCategoriaDocente(null);
        }
      } catch (error) {
        console.error(error);
        Notification.alertError("Error al cargar datos del docente.");
      } finally {
        setLoading(false);
      }
    }

    fetchDocente();
  }, [API, id]);

  // Load opciones dinámicamente para AsyncSelect

  const loadUniversidades = useCallback(
    async (inputValue) => {
      const token = localStorage.getItem("accessToken") || "";
      try {
        const { results } = await fetchUniversidades(1, inputValue, 10, token);
        return results.map((u) => ({
          value: u.UniversidadID,
          label: u.UniversidadNombre,
        }));
      } catch (error) {
        console.error("Error al cargar universidades:", error);
        Notification.alertError("No se pudieron cargar las universidades");
        return [];
      }
    },
    []
  );

  const loadTiposDocente = useCallback(
    async (inputValue) => {
      const token = localStorage.getItem("accessToken") || "";
      try {
        const { results } = await fetchTipoDocentes(1, inputValue, 10, token);
        return results.map((t) => ({
          value: t.TipoDocenteID,
          label: t.TipoDocenteDescripcion,
        }));
      } catch (error) {
        console.error("Error al cargar tipos de docente:", error);
        Notification.alertError("No se pudieron cargar los tipos de docente");
        return [];
      }
    },
    []
  );

  const loadCategoriasDocente = useCallback(
    async (inputValue) => {
      const token = localStorage.getItem("accessToken") || "";
      try {
        const { results } = await fetchCategorias(1, inputValue, 10, token);
        return results.map((c) => ({
          value: c.CategoriaID,
          label: c.CategoriaNombre,
        }));
      } catch (error) {
        console.error("Error al cargar categorías:", error);
        Notification.alertError("No se pudieron cargar las categorías");
        return [];
      }
    },
    []
  );

  // Manejo input normal
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDocente((prev) => ({ ...prev, [name]: value }));
  };

  // Manejo AsyncSelect
  const handleUniversidadChange = (selectedOption) => {
    setDocente((prev) => ({
      ...prev,
      Docente_UniversidadFK: selectedOption ? selectedOption.value : "",
    }));
    setSelectedUniversidad(selectedOption);
  };

  const handleTipoDocenteChange = (selectedOption) => {
    setDocente((prev) => ({
      ...prev,
      Docente_TipoDocenteFK: selectedOption ? selectedOption.value : "",
    }));
    setSelectedTipoDocente(selectedOption);
  };

  const handleCategoriaDocenteChange = (selectedOption) => {
    setDocente((prev) => ({
      ...prev,
      Docente_CategoriaDocenteFK: selectedOption ? selectedOption.value : "",
    }));
    setSelectedCategoriaDocente(selectedOption);
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem("accessToken") || "";
    try {
      const res = await fetch(`${API}api/docente/edit/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(docente),
      });

      if (res.ok) {
        Notification.alertSuccess("Docente actualizado correctamente.");
        router.push("/docenteList");
      } else {
        Notification.alertError("Error al actualizar el docente.");
      }
    } catch (error) {
      console.error(error);
      Notification.alertError("Error inesperado.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className={Styles.container}>
      <form onSubmit={handleSubmit} className={Styles.form}>
        <h1 className={Styles.title}>Editar Docente</h1>

        <div className={Styles.name_group}>
          <label>Código:</label>
          <input
            type="text"
            name="DocenteCodigo"
            value={docente.DocenteCodigo}
            onChange={handleChange}
            disabled
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label>Nombre:</label>
          <input
            type="text"
            name="DocenteNombre"
            value={docente.DocenteNombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label>Apellido:</label>
          <input
            type="text"
            name="DocenteApellido"
            value={docente.DocenteApellido}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles.name_group}>
          <label>Sexo:</label>
          <select
            name="DocenteSexo"
            value={docente.DocenteSexo}
            onChange={handleChange}
            required
          >
            <option value="">-- Seleccione el sexo --</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
        </div>

        <div className={Styles.name_group}>
          <label>Estado Civil:</label>
          <select
            name="DocenteEstadoCivil"
            value={docente.DocenteEstadoCivil}
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
          <label>Tipo Identificación:</label>
          <select
            name="DocenteTipoIdentificacion"
            value={docente.DocenteTipoIdentificacion}
            onChange={handleChange}
          >
            <option value="">-- Seleccione tipo de identificación --</option>
            <option value="Cédula">Cédula</option>
            <option value="Pasaporte">Pasaporte</option>
          </select>
        </div>

        <div className={Styles.name_group}>
          <label>Número Identificación:</label>
          <input
            type="text"
            name="DocenteNumeroIdentificacion"
            value={docente.DocenteNumeroIdentificacion}
            onChange={handleChange}
          />
        </div>

        <div className={Styles.name_group}>
          <label>Fecha Nacimiento:</label>
          <input
            type="date"
            name="DocenteFechaNacimiento"
            value={docente.DocenteFechaNacimiento || ""}
            onChange={handleChange}
          />
        </div>

        <div className={Styles.name_group}>
          <label>Lugar Nacimiento:</label>
          <input
            type="text"
            name="DocenteLugarNacimiento"
            value={docente.DocenteLugarNacimiento}
            onChange={handleChange}
          />
        </div>

        <div className={Styles.name_group}>
          <label>Fecha Ingreso:</label>
          <input
            type="date"
            name="DocenteFechaIngreso"
            value={docente.DocenteFechaIngreso || ""}
            onChange={handleChange}
          />
        </div>

        <div className={Styles.name_group}>
          <label>Nacionalidad:</label>
          <input
            type="text"
            name="DocenteNacionalidad"
            value={docente.DocenteNacionalidad}
            onChange={handleChange}
          />
        </div>

        <div className={Styles.name_group}>
          <label>Teléfono:</label>
          <input
            type="text"
            name="DocenteTelefono"
            value={docente.DocenteTelefono}
            onChange={handleChange}
          />
        </div>

        <div className={Styles.name_group}>
          <label>Correo Electrónico:</label>
          <input
            type="email"
            name="DocenteCorreoElectronico"
            value={docente.DocenteCorreoElectronico}
            onChange={handleChange}
          />
        </div>

        <div className={Styles.name_group}>
          <label>Dirección:</label>
          <input
            type="text"
            name="DocenteDireccion"
            value={docente.DocenteDireccion}
            onChange={handleChange}
          />
        </div>

        <div className={Styles.name_group}>
          <label>Estado:</label>
          <select
            name="DocenteEstado"
            value={docente.DocenteEstado}
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
          <label>Observaciones:</label>
          <textarea
            name="DocenteObservaciones"
            rows="3"
            value={docente.DocenteObservaciones || ""}
            onChange={handleChange}
          />
        </div>

        <div className={Styles.name_group}>
          <label>Universidad:</label>
          <AsyncSelect
            cacheOptions
            defaultOptions
            loadOptions={loadUniversidades}
            value={selectedUniversidad}
            onChange={handleUniversidadChange}
            placeholder="Seleccione una universidad"
            isClearable
            noOptionsMessage={() => "Escribe para buscar universidades"}
            menuPlacement="auto"
            inputId="Docente_UniversidadFK"
          />
        </div>

        <div className={Styles.name_group}>
          <label>Tipo Docente:</label>
          <AsyncSelect
            cacheOptions
            defaultOptions
            loadOptions={loadTiposDocente}
            value={selectedTipoDocente}
            onChange={handleTipoDocenteChange}
            placeholder="Seleccione tipo de docente"
            isClearable
            noOptionsMessage={() => "Escribe para buscar tipos de docente"}
            menuPlacement="auto"
            inputId="Docente_TipoDocenteFK"
          />
        </div>

        <div className={Styles.name_group}>
          <label>Categoría Docente:</label>
          <AsyncSelect
            cacheOptions
            defaultOptions
            loadOptions={loadCategoriasDocente}
            value={selectedCategoriaDocente}
            onChange={handleCategoriaDocenteChange}
            placeholder="Seleccione categoría docente"
            isClearable
            noOptionsMessage={() => "Escribe para buscar categorías"}
            menuPlacement="auto"
            inputId="Docente_CategoriaDocenteFK"
          />
        </div>

        <div className={Styles.btn_group}>
          <button type="submit" className={Styles.btn} disabled={submitting}>
            {submitting ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default withAuth(DocenteEdit);
