"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormLayout from "@components/layouts/FormLayout";
import withAuth from "@utils/withAuth";
import Styles from "@styles/form.module.css"; // Mismo CSS que DocenteForm
import Notification from "@components/Notification";
import Select from "react-select";
import { use } from "react";
function DocenteEdit({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const API = process.env.NEXT_PUBLIC_API_KEY;

  const [docente, setDocente] = useState(null);
  const [universidades, setUniversidades] = useState([]);
  const [tiposDocente, setTiposDocente] = useState([]);
  const [categoriasDocente, setCategoriasDocente] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const docenteRes = await fetch(`${API}api/docente/${id}/`);
        if (!docenteRes.ok) throw new Error("Error al obtener docente");
        const docenteData = await docenteRes.json();

        const [uData, tData, cData] = await Promise.all([
          fetch(`${API}universidades`).then((r) => r.json()),
          fetch(`${API}tipodocentes`).then((r) => r.json()),
          fetch(`${API}categoriadocentes`).then((r) => r.json()),
        ]);

        setDocente({
          ...docenteData,
          Docente_UniversidadFK:
            typeof docenteData.Docente_UniversidadFK === "object"
              ? docenteData.Docente_UniversidadFK.UniversidadID
              : docenteData.Docente_UniversidadFK,
        });

        setUniversidades(
          (uData.results || uData).map((u) => ({
            label: u.UniversidadNombre,
            value: u.UniversidadID,
          }))
        );

        setTiposDocente(
          (tData.results || tData).map((t) => ({
            label: t.TipoDocenteDescripcion,
            value: t.TipoDocenteID,
          }))
        );

        setCategoriasDocente(
          (cData.results || cData).map((c) => ({
            label: c.CategoriaNombre,
            value: c.CategoriaID,
          }))
        );
      } catch (error) {
        console.error("Error:", error);
        Notification.alertError("Error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDocente((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selected, { name }) => {
    setDocente((prev) => ({
      ...prev,
      [name]: selected?.value || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!docente) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API}api/docente/edit/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(docente),
      });

      if (res.ok) {
        Notification.alertSuccess("Docente actualizado con éxito");
        router.push("/docenteList");
      } else {
        const data = await res.json();
        console.error(data);
        Notification.alertError("Fallo al actualizar");
      }
    } catch (err) {
      Notification.alertError("Error de conexión con la API");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !docente) return <div>Cargando datos...</div>;

  return (
    <FormLayout>
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
              <option value="Inactivo">Inactivo</option>
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
            <Select
              name="Docente_UniversidadFK"
              options={universidades}
              placeholder="Seleccione una universidad"
              value={universidades.find((u) => u.value === docente.Docente_UniversidadFK)}
              onChange={handleSelectChange}
            />
          </div>

          <div className={Styles.name_group}>
            <label>Tipo Docente:</label>
            <Select
              name="Docente_TipoDocenteFK"
              options={tiposDocente}
              placeholder="Seleccione tipo de docente"
              value={tiposDocente.find((t) => t.value === docente.Docente_TipoDocenteFK)}
              onChange={handleSelectChange}
            />
          </div>

          <div className={Styles.name_group}>
            <label>Categoría Docente:</label>
            <Select
              name="Docente_CategoriaDocenteFK"
              options={categoriasDocente}
              placeholder="Seleccione categoría docente"
              value={categoriasDocente.find((c) => c.value === docente.Docente_CategoriaDocenteFK)}
              onChange={handleSelectChange}
            />
          </div>

          <div className={Styles.btn_group}>
            <button type="submit" className={Styles.btn} disabled={submitting}>
              {submitting ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </FormLayout>
  );
}

export default withAuth(DocenteEdit);
