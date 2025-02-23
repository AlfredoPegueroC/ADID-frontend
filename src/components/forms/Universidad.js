import { useRouter } from "next/navigation";

import Notification from "../Notification";
import Styles from "@styles/form.module.css";
import { toast, Bounce } from "react-toastify";
export default function Universidad({ title }) {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_KEY;
  

  const handleUniversidad = async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const estado = document.getElementById("estado").value;

    const data = {
      nombre: nombre,
      estado: estado,
    };

    try {
      const response = await fetch(`${API}api/universidad/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const result = await response.json();
        Notification.alertSuccess(`Universidad Creada: ${result.nombre}`);
        router.push("/universidadList");
        
      } else {
        const error = await response.json();
        Notification.alertError(
          `Error al crear la universidad existe en la DB.`
        );
        console.log("aqui", error);
      }
    } catch (error) {
      Notification.alertError(
        "Hubo un error al conectar con la API: " + error.message
      );
    }
  };

  return (
    <div className={Styles.container}>
      <form
        id="universidadForm"
        action="/universidadList"
        onSubmit={handleUniversidad}
        className={Styles.form}
      >
        <h1 className={Styles.title}>{title}</h1>

        <div className={Styles.name_group}>
          <label htmlFor="nombre">Nombre de la Universidad</label>
          <input
            type="text"
            placeholder="Nombre de la Universidad"
            id="nombre"
            required
          />
        </div>
        <div className={Styles.name_group}>
          <label htmlFor="estado">Estado</label>
          <select id="estado" defaultValue="" required>
            <option defaultValue="">-- Seleccione --</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <button type="submit" className={Styles.btn}>
          Enviar
        </button>
      </form>
    </div>
  );
}
