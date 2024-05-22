const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dbPath = path.join(__dirname, '../db.json');

// Leer la base de datos desde el archivo JSON
const readDatabase = () => {
  const data = fs.readFileSync(dbPath);
  return JSON.parse(data);
};

// Ruta para autenticar usuarios
router.post('/login', (req, res) => {
  const { phoneNumber } = req.body;
  const db = readDatabase();

  const user = db.users.find(u => u.phoneNumber === phoneNumber);

  if (user) {
    res.status(200).json({ message: 'Login successful', user });
  } else {
    res.status(401).json({ message: 'Invalid phone number' });
  }
});

module.exports = router;
