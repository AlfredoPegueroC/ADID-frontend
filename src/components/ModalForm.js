"use client"

export default function ModalForm({ title, children, onClose, modelName="Modal"}) {
  return (
    <div
      className="modal fade"
      id={modelName}
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog-centered modal-dialog " style={{ maxWidth: '50%', height: '80vh' }}>
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5 text-dark" id="exampleModalLabel">
              {title}
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {children}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}