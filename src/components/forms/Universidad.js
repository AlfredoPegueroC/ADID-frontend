import { useRouter } from "next/navigation";
import styles from "@styles/Notificacion.module.css"; // Importa el archivo CSS

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
        alertSuccess("Universidad creada con éxito: " + result.nombre);
        setTimeout(() => {
          router.push("/universidadList");
        }, 5000); // 3000 ms = 5 segundos de espera antes de redirigir
      } else {
        const error = await response.json();
        alertError("Error al crear la universidad: " + error.message);
      }
    } catch (error) {
      alertError("Hubo un error al conectar con la API: " + error.message);
    }
  };

  // Función para mostrar el mensaje de éxito
  const alertSuccess = (message) => {
    const alertDiv = document.createElement("div");
    alertDiv.className = styles.alertaExito;
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 5000); // Se elimina el mensaje después de 5 segundos
  };

  // Función para mostrar el mensaje de error
  const alertError = (message) => {
    const alertDiv = document.createElement("div");
    alertDiv.className = styles.alertaError;
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 5000); // Se elimina el mensaje después de 5 segundos
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
