interface PaginationProps {
  page: number;
  lastPage: number;
  total: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, lastPage, total, onChange }: PaginationProps) {
  return (
    <div className="pagination">
      <span className="pagination-info">
        Página {page} de {lastPage} — {total} registro{total === 1 ? '' : 's'}
      </span>
      <div className="pagination-buttons">
        <button className="btn-secondary" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          ‹ Anterior
        </button>
        <button
          className="btn-secondary"
          disabled={page >= lastPage}
          onClick={() => onChange(page + 1)}
        >
          Próxima ›
        </button>
      </div>
    </div>
  );
}
