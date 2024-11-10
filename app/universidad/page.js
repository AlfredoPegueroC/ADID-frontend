"use client";

export default function universidad() {
  const handleUniversidad = async (e) => {
    e.preventDefault();

    document
      .getElementById("universidadForm")
      .addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevenir el envío normal del formulario

        // Obtener valores del formulario
        const universidadCodigo =
          document.getElementById("universidadCodigo").value;
        const nombre = document.getElementById("nombre").value;
        const estado = document.getElementById("estado").value;

        // Construir el objeto de datos
        const data = {
          UniversidadCodigo: universidadCodigo,
          nombre: nombre,
          estado: estado,
        };

        try {
          // Enviar los datos a la API con una solicitud POST
          const response = await fetch(
            "http://127.0.0.1:8000/api/universidad/create",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                // Si necesitas autenticación, agrega el token aquí:
                // 'Authorization': 'Bearer tu_token_aqui'
              },
              body: JSON.stringify(data),
            }
          );

          // Manejar la respuesta de la API
          if (response.ok) {
            const result = await response.json();
            alert("Universidad creada con éxito: " + JSON.stringify(result));
          } else {
            const error = await response.json();
            alert("Error al crear la universidad: " + JSON.stringify(error));
          }
        } catch (error) {
          alert("Hubo un error al conectar con la API: " + error.message);
        }
      });
  };

  return (
    <div>
      <form id="universidadForm" onSubmit={handleUniversidad}>
        <fieldset>
          <label htmlFor="universidadCodigo">Código de la Universidad:</label>
          <input
            type="text"
            placeholder="Código de la Universidad"
            id="universidadCodigo"
            required
          ></input>

          <label htmlFor="nombre">Nombre de la Universidad:</label>
          <input
            type="text"
            placeholder="Nombre de la Universidad"
            id="nombre"
            required
          ></input>

          <label htmlFor="estado">Estado:</label>
          <select id="estado" defaultValue="" required>
            <option value="" disabled selected>
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
