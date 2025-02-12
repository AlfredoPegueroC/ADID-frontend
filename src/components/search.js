export default function Search({ SearchSubmit, SearchChange, searchQuery }) {
  return (
    <div>
      {/* Search Form */}
      <form onSubmit={SearchSubmit} className="d-flex align-items-center mb-3">
        <input
          type="text"
          className="form-control me-2" // `me-2` adds right margin for spacing
          placeholder="Buscar..."
          value={searchQuery}
          onChange={SearchChange}
        />
        <button
          className="btn btn-primary"
          type="submit"
        >
          Buscar
        </button>
      </form>
    </div>
  );
}
