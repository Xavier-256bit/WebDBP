import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Ejercicios = () => {
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
  
        <section id="changeExercise">
            <div className="imagen-item">
              <img
                src={`images/abdominales.jpg`}
                alt="Imagen 1"
                height="200"
              />
              <p>Abdominales</p>
            </div>
            <div className="imagen-item">
              <img
                src={`images/estiramientos.jpg`}
                alt="Imagen 2"
                height="200"
              />
              <p>Estiramientos</p>
            </div>
            <div className="imagen-item">
              <img
                src={`images/saltodetijeras.jpeg`}
                alt="Imagen 3"
                height="200"
              />
              <p>Salto de tijeras</p>
            </div>
            <div className="imagen-item">
              <img
                src={`images/sentadillas.jpg`}
                alt="Imagen 4"
                height="200"
              />
              <p>Sentadillas</p>
            </div>
            <div className="imagen-item">
              <img
                src={`images/zancadas.jpeg`}
                alt="Imagen 5"
                height="200"
              />
              <p>Zancadas</p>
            </div>
        </section>
  
        <footer>
          <p>&copy; CcalloCORP</p>
        </footer>
      </div>
    );
  };
  
  export default Ejercicios;