import Notification from '@components/Notification'

export const deleteEntity = async (endpoint, pk, setEntities, idKey = "id") => {
  const confirmDelete = window.confirm("¿Estás seguro de querer eliminar?");
  
  if (confirmDelete) {
    try {
      const response = await fetch(`${endpoint}/${pk}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        setEntities((prevEntities) => prevEntities.filter((entity) => entity[idKey] !== pk)
        
      );
        Notification.alertLogin("Elemento eliminado con éxito.");
      } else {
        Notification.alertError("Error al eliminar el elemento.")
      }
    } catch (error) {
      console.error("Error deleting entity:", error);
      Notification.alertError("Error al eliminar el elemento.")

    }
  }
};
