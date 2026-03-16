const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  return (
    <nav>
      <ul className="pagination justify-content-center mt-4">
        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPageChange(page - 1)}>Previous</button>
        </li>
        {Array.from({ length: pages }, (_, index) => index + 1).map((current) => (
          <li key={current} className={`page-item ${current === page ? "active" : ""}`}>
            <button className="page-link" onClick={() => onPageChange(current)}>{current}</button>
          </li>
        ))}
        <li className={`page-item ${page === pages ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPageChange(page + 1)}>Next</button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
