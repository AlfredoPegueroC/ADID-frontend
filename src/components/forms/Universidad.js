import { useRouter } from "next/navigation";
import styles from "@styles/Notificacion.module.css";

import Notification from "../Notification";


export default function Universidad({ title }) {
  const router = useRouter();

  const handleUniversidad = async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const estado = document.getElementById("estado").value;

    const data = {
      nombre: nombre,
      estado: estado,
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/universidad/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        const result = await response.json();
        router.push("/universidadList");
        Notification.alertSuccess("Universidad creada con éxito: " + result.nombre);
      } else {
        const error = await response.json();
        Notification.alertError("Error al crear la universidad: " + error.message);
      }
    } catch (error) {
      Notification.alertError("Hubo un error al conectar con la API: " + error.message);
    }
  };


  return (
    <div>
      <form
        id="universidadForm"
        action="/universidadList"
        onSubmit={handleUniversidad}
      >
        <legend>{title}</legend>
        <fieldset>
          <label htmlFor="nombre">Nombre de la Universidad:</label>
          <input
            type="text"
            placeholder="Nombre de la Universidad"
            id="nombre"
            required
          />

          <label htmlFor="estado">Estado:</label>
          <select id="estado" defaultValue="" required>
            <option defaultValue="" disabled>
              -- Seleccione --
            </option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </fieldset>

        <input type="submit" value="Enviar" className={styles.botonVerde} />
      </form>
    </div>
  );
}
