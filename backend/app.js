const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./src/routes/authRoutes');
const sql = require('mssql');
const { dbConfig } = require('./src/config/env');

const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(bodyParser.json());

// Conectar a la base de datos
sql.connect(dbConfig)
    .then(() => {
        console.log('Conectado a la base de datos');
    })
    .catch(err => {
        console.error('Error conectando a la base de datos:', err.message);
    });

// Uso de la ruta de autenticación
app.use('/api/auth', authRoutes);

// Manejar errores 404
app.use((req, res, next) => {
    res.status(404).send('Recurso no encontrado');
});

// Manejar errores generales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error del servidor');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
