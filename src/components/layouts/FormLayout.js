"use client";


export default function FormLayout({ title, children }) {
  return (
    <div className="form-container  d-flex justify-content-center align-items-center mt-5">
      <h2>{title}</h2>
      <div className="form-content">{children}</div>
    </div>
  );
}
