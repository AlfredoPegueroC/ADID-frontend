// app/components/FacultadForm.js
"use client"; 

import { useEffect, useState } from 'react';

export default function FacultadForm({title}) {
    const [universidades, setUniversidades] = useState([]);
    const [formData, setFormData] = useState({
        facultadCodigo: '',
        nombre: '',
        universidadCodigo: '',
        estado: ''
    });

    // Load universities on component mount
    useEffect(() => {
        async function cargarUniversidades() {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/universidad');
                if (!response.ok) throw new Error('Failed to fetch universities');
                
                const data = await response.json();
                setUniversidades(data);
            } catch (error) {
                console.error('Error loading universities:', error);
                alert('No se pudieron cargar las universidades');
            }
        }
        cargarUniversidades();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://127.0.0.1:8000/api/facultad/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Facultad creada exitosamente');
                setFormData({
                    facultadCodigo: '',
                    nombre: '',
                    universidadCodigo: '',
                    estado: ''
                });
            } else {
                const errorData = await response.json();
                alert('Error al crear la facultad: ' + JSON.stringify(errorData));
            }
        } catch (error) {
            console.error('Error creating faculty:', error);
            alert('Hubo un problema al crear la facultad');
        }
    };

    return (
        <div>
            <form id="facultadForm" onSubmit={handleSubmit}>
                <fieldset>
                    <legend>{title}</legend>

                    <label htmlFor="facultadCodigo">Código de la Facultad:</label>
                    <input
                        type="number"
                        placeholder="Código de la Facultad"
                        id="facultadCodigo"
                        value={formData.facultadCodigo}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="nombre">Nombre de la Facultad:</label>
                    <input
                        type="text"
                        placeholder="Nombre de la Facultad"
                        id="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="universidadCodigo">Universidad:</label>
                    <select
                        id="universidadCodigo"
                        value={formData.universidadCodigo}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="" disabled>
                            -- Seleccione una Universidad --
                        </option>
                        {universidades.map((universidad) => (
                            <option key={universidad.UniversidadCodigo} value={universidad.UniversidadCodigo}>
                                {universidad.nombre}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="estado">Estado:</label>
                    <select
                        id="estado"
                        value={formData.estado}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="" disabled>
                            -- Seleccione --
                        </option>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                </fieldset>

                <input type="submit" value="Enviar" className="boton-verde" />
            </form>
        </div>
    );
}
