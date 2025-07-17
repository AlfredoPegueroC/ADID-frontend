export default function Spinner() {
  return (
    <div
      className="spinner-border text-primary"
      role="status"
      style={{ width: "2.5rem", height: "2.5rem" }}
    >
      <span className="visually-hidden">Cargando...</span>
    </div>
  );
}
