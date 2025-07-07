export default function DashboardTable({ rows }) {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered">
        <thead className="table-light">
          <tr>
            <th>File Name</th>
            <th>Import Date</th>
            <th>Records</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              <td>{row.archivo}</td>
              <td>{row.fecha}</td>
              <td>{row.registros}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
