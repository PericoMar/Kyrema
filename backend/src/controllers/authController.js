const sql = require('mssql');
const jwt = require('jsonwebtoken');
const { dbConfig, jwtSecret } = require('../config/env');

async function login(req, res) {
  const { username, password } = req.body;

  try {
    await sql.connect(dbConfig);
    const result = await sql.query`
      SELECT id, username, email, role, society 
      FROM Users 
      WHERE username = ${username} AND password = ${password}`;

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = result.recordset[0];
    const token = jwt.sign({ id: user.id, username: user.username }, jwtSecret);
    
    return res.json({ 
      token, 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        society: user.society
      } 
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  } finally {
    sql.close();
  }
}

module.exports = {
  login
};

