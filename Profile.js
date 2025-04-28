// src/components/Profile.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('nickname');
    if (stored) setNickname(stored);
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage('Selecciona un archivo primero');

    const formData = new FormData();
    formData.append('archivo', file);

    try {
      const res = await axios.post(
        'http://localhost:5000/upload-avatar',
        formData
      );
      console.log('Respuesta upload:', res.data);
      setMessage(res.data.message);
    } catch (err) {
      console.error('Error al subir la foto:', err.response?.data || err.message);
      setMessage(
        err.response?.data?.message || 'Error al subir la foto'
      );
    }
  };

  return (
    <div>
      <header>
        <div id="logo">
          <img
            src={`${process.env.PUBLIC_URL}/img/logo.png`}
            alt="logo"
            height="100"
          />
        </div>
        <nav className="menu">
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/progreso">Progreso</Link></li>
            <li><Link to="/tienda">Tienda</Link></li>
          </ul>
        </nav>
      </header>

      <section id="contenido">
        <img
          src={`${process.env.PUBLIC_URL}/img/perfil.jpg`}
          alt="perfil"
          height="200"
        />
        <h1>{nickname || 'Usuario'}</h1>

        <form onSubmit={handleUpload} encType="multipart/form-data">
          <label>
            Cambiar Foto de Perfil:
            <input
              name="archivo"
              id="archivo"
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              required
            />
          </label>
          <button type="submit">Subir</button>
        </form>

        {message && <p>{message}</p>}
      </section>

      <footer>
        <p>&copy; CcalloCORP</p>
      </footer>
    </div>
  );
};

export default Profile;
