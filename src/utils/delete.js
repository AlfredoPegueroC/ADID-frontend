
export const deleteEntity = async (endpoint, pk, setEntities, idKey = "id") => {
  const confirmDelete = window.confirm("¿Estás seguro de querer eliminar?");
  if (confirmDelete) {
    try {
      const response = await fetch(`${endpoint}/${pk}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        setEntities((prevEntities) =>
          prevEntities.filter((entity) => entity[idKey] !== pk)
      );
        alert("Elemento eliminado con éxito.");
      } else {
        alert("Error al eliminar el elemento.")
      }
    } catch (error) {
      console.error("Error deleting entity:", error);
      alert("Error al eliminar el elemento.");
    }
  }
};
