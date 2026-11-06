const express = require('express');
const router = express.Router();
const conexion = require('../db');


router.get('/', (req, res) => {
  conexion.query(`
    SELECT c.idCiudad, c.nombre AS ciudad,
           d.nombre AS departamento,
           p.nombre AS pais
    FROM ciudad c
    JOIN departamento d ON c.idDepartamento = d.idDepartamento
    JOIN pais p ON d.idPais = p.idPais
  `, (err, result) => {
    if (err) return res.json(err);
    res.json(result);
  });
});


router.post('/', (req, res) => {
  const { idDepartamento, nombre } = req.body;

  conexion.query(
    'INSERT INTO ciudad (nombre, idDepartamento) VALUES (?, ?)',
    [nombre, idDepartamento],
    (err) => {
      if (err) return res.json(err);
      res.json({ mensaje: "Ciudad guardada" });
    }
  );
});


router.delete('/:id', (req, res) => {
  conexion.query(
    'DELETE FROM ciudad WHERE idCiudad=?',
    [req.params.id],
    (err) => {
      if (err) return res.json(err);
      res.json({ mensaje: "Eliminado" });
    }
  );
});

module.exports = router;