"use client"
import Link from 'next/link';
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet"></link>
import { useState } from 'react';

export default function ImportPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  // Handle file input change
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('excel_file', file);

    try {
      const response = await fetch('http://localhost:8000/import/asignacion', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message || 'Import successful');
      } else {
        setMessage(result.error || 'Error during import');
      }
    } catch (error) {
      setMessage('An error occurred while uploading the file.');
    }
  };

  return (
  
    <div style={{
      maxWidth: '400px',
      margin: '9.5rem auto',
      padding: '20px',
      backgroundColor: ' #d9e8fb',
      borderRadius: '10px',
      boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      fontFamily: 'Roboto',
      fontSize: "1.1rem"
    }}>
      <h3 style={{
        fontSize: '1.5em',
        color: '#333',
        marginBottom: '20px',
        fontFamily: "Roboto"
      }}>Importar Archivo Excel</h3>
  
      <form style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }} onSubmit={handleSubmit}>
        <div style={{
          position: 'relative',
          width: '100%',
          marginBottom: '20px'
        }}>
          <input
            style={{
              opacity: 0,
              position: 'absolute',
              width: '100%',
              height: '100%',
              cursor: 'pointer'
            }}
            type="file"
            onChange={handleFileChange}
            accept=".xls,.xlsx"
            required
          />
          <label htmlFor="file" style={{
            display: 'block',
            width: '100%',
            padding: '12px',
            backgroundColor: '#007bff',
            color: 'white',
            textAlign: 'center',
            borderRadius: '1rem',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}>
            Selecionar Archivo
          </label>
        </div>
        <img
            src="/ExcelLogo.png"
            alt="Logo"
            style={{ height: "100px",
               marginLeft: "0px", 
               paddingRight: "10px", 
               textAlign: "center",
               position: "absolute",
               top: "20%",
               left: "50%",
               transform: "translate(-50%, -50px)",
               borderRadius: "1rem"
              }}
          />
        <button style={{
          backgroundColor: '#28a745',
          width: "50%",
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '1rem',
          cursor: 'pointer',
          fontSize: '1em',
          transition: 'background-color 0.3s ease',
          marginTop: "-0.5rem",
        }} type="submit">
          Subir
        </button>
      </form>
  
      {message && <p style={{
        marginTop: '20px',
        color: '#6c757d'
      }}>{message}</p>}
    </div>
  );
  
}
