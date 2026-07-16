const { Router } = require('express');
const pool = require('../config/db');

const router = Router();

// GET all networks
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM networks ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET network by id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM networks WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Network not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create network
router.post('/', async (req, res) => {
  const { name, chain_id, rpc_url, symbol } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO networks (name, chain_id, rpc_url, symbol) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, chain_id, rpc_url, symbol]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update network
router.put('/:id', async (req, res) => {
  const { name, chain_id, rpc_url, symbol } = req.body;
  try {
    const result = await pool.query(
      'UPDATE networks SET name = $1, chain_id = $2, rpc_url = $3, symbol = $4 WHERE id = $5 RETURNING *',
      [name, chain_id, rpc_url, symbol, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Network not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE network
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM networks WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Network not found' });
    res.json({ message: 'Network deleted', network: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
