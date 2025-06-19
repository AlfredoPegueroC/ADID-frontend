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
    <div className="d-flex justify-content-center">
      <form onSubmit={SearchSubmit} className="d-flex align-items-center">
        <input
          type="text"
          className="form-control me-2"
          style={{
            width: "15rem",
            outline: "1px solid #007bff",
            borderRadius: "8px",
            
          }}
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
