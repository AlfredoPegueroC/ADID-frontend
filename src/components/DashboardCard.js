
import Link from "next/link";
export default function DashboardCard({ title, value, icon, warning = false, link = "#" }) {
  return (
    <div className="col-6 col-md-3">
      <Link href={link} className="text-decoration-none">
        <div className={`card h-100 text-dark ${warning ? "border-warning" : "border-light"}`}> 
          <div className="card-body d-flex align-items-center gap-3">
            <div className={`bg-${warning ? "warning" : "primary"} bg-opacity-10 rounded-circle p-3`}>
              <i className={`bi ${icon} fs-3 text-${warning ? "warning" : "primary"}`}></i>
            </div>
            <div>
              <h4 className="mb-0 fw-bold">{value}</h4>
              <small className="text-muted">{title}</small>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
