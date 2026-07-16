const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all networks
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM networks ORDER BY name ASC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET network by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM networks WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Network not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create network
router.post('/', async (req, res) => {
  try {
    const {
      name,
      chain_id = null,
      rpc_url = null,
      is_active = true
    } = req.body;

    const result = await pool.query(
      `INSERT INTO networks (
        name,
        chain_id,
        rpc_url,
        is_active
      ) VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [
        name,
        chain_id,
        rpc_url,
        is_active
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update network
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      chain_id = null,
      rpc_url = null,
      is_active = true
    } = req.body;

    const result = await pool.query(
      `UPDATE networks
       SET name = $1,
           chain_id = $2,
           rpc_url = $3,
           is_active = $4
       WHERE id = $5
       RETURNING *`,
      [
        name,
        chain_id,
        rpc_url,
        is_active,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Network not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE network
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM networks WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Network not found' });
    }

    res.json({ message: 'Network deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;