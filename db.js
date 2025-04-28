// db.js (backend)

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 5000;

// middleware global
app.use(express.json());
app.use(cors());

// configurar base datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'DBP_app',
});

db.connect(err => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1);
  }
  console.log('Conexión exitosa a la base de datos');
});

//multer configuración de subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads')); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, 'avatar-' + uniqueSuffix);
  }
});
const upload = multer({ storage });

// poner archivos de uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// routes

// prueba ruta
app.get('/', (req, res) => {
  res.send('Servidor Express funcionando correctamente');
});

//registro de usuarios
app.post('/register', async (req, res) => {
  console.log('Datos recibidos:', req.body);
  const { nombre, apellidos, nickname, contraseña, correo, edad, imc, frecuencia, experiencia } = req.body;
  if (!nombre || !apellidos || !nickname || !contraseña || !correo || !edad || !imc || !frecuencia || !experiencia) {
    return res.status(400).send('Faltan datos requeridos');
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);
    const query = `
      INSERT INTO usuarios 
        (nombre, apellidos, nickname, contraseña, correo, edad, imc, frecuencia, experiencia)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(query,
      [nombre, apellidos, nickname, hashedPassword, correo, edad, imc, frecuencia, experiencia],
      (err, result) => {
        if (err) {
          console.error('ERROR SQL al insertar usuario:', err.sqlMessage || err);
          return res.status(500).send('Error al registrar usuario');
        }
        console.log('Usuario registrado con ID:', result.insertId);
        res.status(200).send('Usuario registrado con éxito');
      }
    );
  } catch (err) {
    console.error('Error al encriptar la contraseña:', err);
    res.status(500).send('Error al encriptar la contraseña');
  }
});

//inicio sesion
app.post('/login', (req, res) => {
  console.log('Login request body:', req.body);
  const { nickname, contraseña } = req.body;
  if (!nickname || !contraseña) {
    return res.status(400).send('Faltan credenciales');
  }
  const query = 'SELECT * FROM usuarios WHERE nickname = ?';
  db.query(query, [nickname], async (err, results) => {
    if (err) {
      console.error('Error al verificar usuario:', err);
      return res.status(500).send('Error al verificar usuario');
    }
    if (results.length === 0) {
      return res.status(400).send('Usuario no encontrado');
    }
    const user = results[0];
    try {
      const isMatch = await bcrypt.compare(contraseña, user.contraseña);
      if (!isMatch) {
        return res.status(400).send('Credenciales incorrectas');
      }
      res.status(200).send('Inicio de sesión exitoso');
    } catch (compareErr) {
      console.error('Error al comparar contraseñas:', compareErr);
      res.status(500).send('Error al procesar inicio de sesión');
    }
  });
});
 //subida de foto para el avatar
app.post('/upload-avatar', (req, res) => {
  upload.single('archivo')(req, res, (err) => {
    if (err) {
      console.error('Error Multer:', err);
      return res.status(500).json({ message: 'Error interno al procesar archivo', error: err.message });
    }
    if (!req.file) {
      console.warn('No se recibió req.file');
      return res.status(400).json({ message: 'No se subió ningún archivo' });
    }
    console.log('Archivo subido:', req.file);
    res.json({ message: 'Archivo subido con éxito', filename: req.file.filename });
  });
});

// --------------------------------------
// inicio del servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
