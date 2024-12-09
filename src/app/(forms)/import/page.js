"use client"
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
    <div>
      <h3 className='mt-5'>Import Excel File</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".xls,.xlsx"
          required
        />
        <button type="submit">Upload</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
