import styles from "@styles/Notificacion.module.css"; 

function alertSuccess(message) {
  const alertDiv = document.createElement("div");
  alertDiv.className = styles.alertaExito;
  alertDiv.textContent = message;
  document.body.appendChild(alertDiv);
  setTimeout(() => alertDiv.remove(), 2000);
};

function alertError(message){
  const alertDiv = document.createElement("div");
  alertDiv.className = styles.alertaError;
  alertDiv.textContent = message;
  document.body.appendChild(alertDiv);
  setTimeout(() => {alertDiv.remove()}, 2000); 
};

export default{ alertSuccess, alertError}