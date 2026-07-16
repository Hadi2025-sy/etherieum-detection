const { Router } = require('express');
const pool = require('../config/db');

const router = Router();

// GET all wallets
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM wallets ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET wallet by id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM wallets WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Wallet not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create wallet
router.post('/', async (req, res) => {
  const { address, network_id, user_id, label } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO wallets (address, network_id, user_id, label) VALUES ($1, $2, $3, $4) RETURNING *',
      [address, network_id, user_id, label]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update wallet
router.put('/:id', async (req, res) => {
  const { address, network_id, user_id, label } = req.body;
  try {
    const result = await pool.query(
      'UPDATE wallets SET address = $1, network_id = $2, user_id = $3, label = $4 WHERE id = $5 RETURNING *',
      [address, network_id, user_id, label, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Wallet not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE wallet
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM wallets WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Wallet not found' });
    res.json({ message: 'Wallet deleted', wallet: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
