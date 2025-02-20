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
    <div>
    
      <form onSubmit={SearchSubmit} className="d-flex align-items-center mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Buscar..."
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
