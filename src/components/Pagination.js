"use client"

export default function Pagination({ page, totalPages, onPageChange }){
  const handlePagination = (direction) => {
    if (direction === 'next' && page < totalPages) {
      onPageChange(page + 1);
    } else if (direction === 'prev' && page > 1) {
      onPageChange(page - 1);
    }
  };

  return (
    <div className="d-flex justify-content-between mt-3">
      <button
        className="btn btn-secondary"
        disabled={page <= 1}
        onClick={() => handlePagination("prev")}
      >
        Anterior
      </button>
      <span className="text-dark">
        Página {page} de {totalPages}
      </span>
      <button
        className="btn btn-secondary"
        disabled={page >= totalPages}
        onClick={() => handlePagination("next")}
      >
        Siguiente
      </button>
    </div>
  );
};

