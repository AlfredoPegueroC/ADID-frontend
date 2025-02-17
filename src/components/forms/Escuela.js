import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Notification from "../Notification";
import Styles from "@styles/form.module.css";

export default function EscuelaForm() {
  const router = useRouter();
  const [universidades, setUniversidades] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [filteredFacultades, setFilteredFacultades] = useState([]); 
  const [formData, setFormData] = useState({
    escuelaCodigo: "",
    nombre: "",
    estado: "",
    UniversidadCodigo: "",
    facultadCodigo: "",
  });
  const API = process.env.NEXT_PUBLIC_API_KEY;

  useEffect(() => {
    const fetchUniversidades = async () => {
      try {
        const response = await fetch(`${API}/api/universidad`);
        const data = await response.json();
        setUniversidades(data.results);
      } catch (error) {
        console.error("Error fetching universities:", error);
      }
    };

    const fetchFacultades = async () => {
      try {
        const response = await fetch(`${API}/api/facultad`);
        const data = await response.json();
        setFacultades(data.results);
      } catch (error) {
        console.error("Error fetching faculties:", error);
      }
    };

    fetchUniversidades();
    fetchFacultades();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });


    if (id === "UniversidadCodigo") {
      const filtered = facultades.filter(
        (facultad) => facultad.UniversidadCodigo === parseInt(value)
      );
      setFilteredFacultades(filtered);
      setFormData({
        ...formData,
        [id]: value,
        facultadCodigo: "", 
      });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      UniversidadCodigo: parseInt(formData.UniversidadCodigo),
      facultadCodigo: parseInt(formData.facultadCodigo),
    };

    try {
      const response = await fetch(`${API}/api/escuela/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        setFormData({
          escuelaCodigo: "",
          nombre: "",
          estado: "",
          UniversidadCodigo: "",
          facultadCodigo: "",
        });
        router.push("/escuelaList");
        Notification.alertSuccess("Escuela creada exitosamente");
      } else {
        const errorData = await response.json();
        Notification.alertError(
          "Error al crear la escuela, ya existe en la DB"
        );
      }
    } catch (error) {
      Notification.alertError(
        "Error al enviar el formulario: " + error.message
      );
    }
  };

  return (
    <div className={Styles.container}>
      <form onSubmit={handleSubmit} className={Styles.form}>
        <h1 className={Styles.title}>Registrar Escuela</h1>

        <div className={Styles.names}>
          <div className={Styles.name_group}>
            <label htmlFor="nombre">Nombre de la Escuela:</label>
            <input
              type="text"
              id="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre de escuela"
              required
            />
          </div>

          <div className={Styles.name_group}>
            <label htmlFor="estado">Estado:</label>
            <select
              id="estado"
              value={formData.estado}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                -- Seleccione el estado --
              </option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="UniversidadCodigo">Universidad:</label>
          <select
            id="UniversidadCodigo"
            value={formData.UniversidadCodigo}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              -- Seleccione una Universidad --
            </option>
            {universidades.map((universidad) => (
              <option
                key={universidad.UniversidadCodigo}
                value={universidad.UniversidadCodigo}
              >
                {universidad.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className={Styles.name_group}>
          <label htmlFor="facultadCodigo">Facultad:</label>
          <select
            id="facultadCodigo"
            value={formData.facultadCodigo}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              -- Seleccione una Facultad --
            </option>
            {filteredFacultades.map((facultad) => (
              <option
                key={facultad.facultadCodigo}
                value={facultad.facultadCodigo}
              >
                {facultad.nombre}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className={Styles.btn}>
          Enviar
        </button>
      </form>
    </div>
  );
}
