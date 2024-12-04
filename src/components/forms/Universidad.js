"use client";
import { Alert } from 'bootstrap/dist/js/bootstrap.bundle';
import { useRouter } from 'next/navigation';

export default function universidad({title}) {
  const router = useRouter()

  const handleUniversidad = async (e) => {
    e.preventDefault();
        const nombre = document.getElementById("nombre").value;
        const estado = document.getElementById("estado").value;

        // Construir el objeto de datos
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
          )
          if (response.ok) {
            const result = await response.json();
            alert("Universidad creada con éxito: " + JSON.stringify(result));
            router.push('/universidadList');

          } else {
            const error = await response.json();
            alert("Error al crear la universidad: " + JSON.stringify(error));
          }
        } catch (error) {
          alert("Hubo un error al conectar con la API: " + error.message);
        }
  };

  return (
    <div>
      <form id="universidadForm" action='/universidadList' onSubmit={handleUniversidad}>
        <legend>{title}</legend>
        <fieldset>
          <label htmlFor="nombre">Nombre de la Universidad:</label>
          <input
            type="text"
            placeholder="Nombre de la Universidad"
            id="nombre"
            required
          ></input>

          <label htmlFor="estado">Estado:</label>
          <select id="estado" defaultValue="" required>
            <option defaultValue="" disabled selected>
              -- Seleccione --
            </option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </fieldset>

        <input type="submit" value="Enviar" className="boton-verde"></input>
      </form>
    </div>
  );
}
