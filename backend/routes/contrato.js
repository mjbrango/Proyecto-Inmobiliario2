const express = require('express');
const router = express.Router();
const conexion = require('../db');


router.get('/', (req, res) => {
  conexion.query(`
    SELECT ct.*, p.nombre AS cliente, a.direccion
    FROM contrato ct
    JOIN cliente cl ON ct.idCliente = cl.idCliente
    JOIN persona p ON cl.idPersona = p.idPersona
    JOIN apartamento a ON ct.idApartamento = a.idApartamento
  `, (err, result) => {
    if (err) return res.json(err);
    res.json(result);
  });
});


router.post('/', (req, res) => {
  const { idCliente, idApartamento, fechaInicio, fechaFin, valorMensual, observacion } = req.body;

  conexion.query(
    `INSERT INTO contrato 
    (idCliente, idApartamento, fechaInicio, fechaFin, valorMensual, observacion)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [idCliente, idApartamento, fechaInicio, fechaFin, valorMensual, observacion],
    err => {
      if (err) return res.json(err);
      res.json({ mensaje: 'Contrato creado' });
    }
  );
});

router.put('/:id', (req, res) => {
  const { fechaFin, valorMensual, observacion } = req.body;

  conexion.query(
    `UPDATE contrato 
     SET fechaFin=?, valorMensual=?, observacion=? 
     WHERE idContrato=?`,
    [fechaFin, valorMensual, observacion, req.params.id],
    err => {
      if (err) return res.json(err);
      res.json({ mensaje: 'Actualizado' });
    }
  );
});


router.delete('/:id', (req, res) => {
  conexion.query(
    'DELETE FROM contrato WHERE idContrato=?',
    [req.params.id],
    err => {
      if (err) return res.json(err);
      res.json({ mensaje: 'Eliminado' });
    }
  );
});

module.exports = router;