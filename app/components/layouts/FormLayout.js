"use client";

export default function FormLayout({ title, children }) {
  return (
      <div className="form-container">
          <h2>{title}</h2>
          <div className="form-content">
              {children}
          </div>
          {/* <style jsx>{`
              .form-container {
                  max-width: 600px;
                  margin: auto;
                  padding: 1rem;
                  border-radius: 8px;
              }
              .form-content {
                  display: flex;
                  flex-direction: column;
              }
          `}</style> */}
      </div>
  );
}
