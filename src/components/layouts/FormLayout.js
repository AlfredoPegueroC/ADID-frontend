"use client";


export default function FormLayout({ title, children }) {
  return (
    <div className="mt-0 form-container  d-flex justify-content-center align-items-center">
      <h2>{title}</h2>
      <div className="form-content">{children}</div>
    </div>
  );
}
