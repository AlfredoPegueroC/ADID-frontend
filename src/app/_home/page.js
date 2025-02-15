<Tables>
        <thead>
          <tr>
            <th scope="col">Período</th>
            <th scope="col">Acción</th>
          </tr>
        </thead>
        <tbody>
          {asignacion.length === 0 ? (
            <tr>
              <td colSpan="2" className="text-center">
                No se encontraron asignaciones.
              </td>
            </tr>
          ) : (
            asignacion.map((asig) => (
              <tr key={asig.period}>
                <Link href={`/asignacionDocente/${asig.period}`}>
                  <td className="d-flex align-items-center gap-3">
                    {" "}
                    <Image
                      src="/excel-icon.png"
                      alt="excel"
                      width={32}
                      height={32}
                    />{" "}
                    {asig.period}
                  </td>
                </Link>

                <td>
                  <Link
                    className="btn btn-success btn-sm ms-1"
                    href={`http://127.0.0.1:8000/export/asignacionDocenteExport?period=${asig.period}`}
                  >
                    <Image
                      src="/descargar-icon.svg"
                      alt="borrar"
                      width={20}
                      height={20}
                    />
                  </Link>

                  <button
                    className="btn btn-danger btn-sm ms-1 "
                    onClick={() => handleDelete(asig.period)}
                  >
                    <Image
                      src="/delete.svg"
                      alt="borrar"
                      width={20}
                      height={20}
                    />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Tables>