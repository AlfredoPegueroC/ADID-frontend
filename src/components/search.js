import { useState, useEffect, useCallback } from "react";

export default function Search({ SearchSubmit, SearchChange, searchQuery }) {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      SearchChange({ target: { value: localQuery } });
    }, 500); 

    return () => clearTimeout(timer);
  }, [localQuery, SearchChange]);

  const handleInputChange = useCallback((e) => {
    setLocalQuery(e.target.value);
  }, []);

  return (
    <div className="d-flex justify-content-center mt-4">
  <form onSubmit={SearchSubmit} className="d-flex align-items-center mb-3">
    <input
      type="text"
      className="form-control me-2"
      style={{ width: "50rem", border: "2px solid #007bff", borderRadius: "8px", padding: "7.5px" }}
      placeholder="🔎 Buscar..."
      value={localQuery}
      onChange={handleInputChange}
    />
    <button className="btn btn-primary" type="submit">
      Buscar
    </button>
  </form>
</div>
  );
}
