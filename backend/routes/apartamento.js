const express = require('express');
const router = express.Router();
const conexion = require('../db');


router.get('/', (req, res) => {
  conexion.query(`
    SELECT a.*, p.nombre AS propietario, c.nombre AS ciudad
    FROM apartamento a
    JOIN propietario pr ON a.idPropietario = pr.idPropietario
    JOIN persona p ON pr.idPersona = p.idPersona
    JOIN ciudad c ON a.idCiudad = c.idCiudad
  `, (err, result) => {
    if (err) return res.json(err);
    res.json(result);
  });
});


router.post('/', (req, res) => {
  const { idPropietario, idCiudad, direccion, numeroHabitacion, estado, pagoMensual } = req.body;

  conexion.query(
    `INSERT INTO apartamento 
    (idPropietario, idCiudad, direccion, numeroHabitacion, estado, pagoMensual)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [idPropietario, idCiudad, direccion, numeroHabitacion, estado, pagoMensual],
    err => {
      if (err) return res.json(err);
      res.json({ mensaje: 'Apartamento creado' });
    }
  );
});


router.put('/:id', (req, res) => {
  const { direccion, numeroHabitacion, estado, pagoMensual } = req.body;

  conexion.query(
    `UPDATE apartamento 
     SET direccion=?, numeroHabitacion=?, estado=?, pagoMensual=? 
     WHERE idApartamento=?`,
    [direccion, numeroHabitacion, estado, pagoMensual, req.params.id],
    err => {
      if (err) return res.json(err);
      res.json({ mensaje: 'Actualizado' });
    }
  );
});

router.delete('/:id', (req, res) => {
  conexion.query(
    'DELETE FROM apartamento WHERE idApartamento=?',
    [req.params.id],
    err => {
      if (err) return res.json(err);
      res.json({ mensaje: 'Eliminado' });
    }
  );
});

module.exports = router;