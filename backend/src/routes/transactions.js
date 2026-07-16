const { Router } = require('express');
const pool = require('../config/db');

const router = Router();

const ETH_ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;
const TX_HASH_RE = /^0x[0-9a-fA-F]{64}$/;

// GET all transactions
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transactions ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET transaction by id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transactions WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Transaction not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create transaction
router.post('/', async (req, res) => {
  const { tx_hash, from_address, to_address, value, network_id, block_number, timestamp } = req.body;
  if (tx_hash && !TX_HASH_RE.test(tx_hash)) {
    return res.status(400).json({ error: 'Invalid transaction hash format' });
  }
  if ((from_address && !ETH_ADDRESS_RE.test(from_address)) || (to_address && !ETH_ADDRESS_RE.test(to_address))) {
    return res.status(400).json({ error: 'Invalid Ethereum address format' });
  }
  if (block_number !== undefined && (!Number.isInteger(Number(block_number)) || Number(block_number) < 0)) {
    return res.status(400).json({ error: 'block_number must be a non-negative integer' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO transactions (tx_hash, from_address, to_address, value, network_id, block_number, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [tx_hash, from_address, to_address, value, network_id, block_number, timestamp]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update transaction
router.put('/:id', async (req, res) => {
  const { tx_hash, from_address, to_address, value, network_id, block_number, timestamp } = req.body;
  if (tx_hash && !TX_HASH_RE.test(tx_hash)) {
    return res.status(400).json({ error: 'Invalid transaction hash format' });
  }
  if ((from_address && !ETH_ADDRESS_RE.test(from_address)) || (to_address && !ETH_ADDRESS_RE.test(to_address))) {
    return res.status(400).json({ error: 'Invalid Ethereum address format' });
  }
  if (block_number !== undefined && (!Number.isInteger(Number(block_number)) || Number(block_number) < 0)) {
    return res.status(400).json({ error: 'block_number must be a non-negative integer' });
  }
  try {
    const result = await pool.query(
      'UPDATE transactions SET tx_hash = $1, from_address = $2, to_address = $3, value = $4, network_id = $5, block_number = $6, timestamp = $7 WHERE id = $8 RETURNING *',
      [tx_hash, from_address, to_address, value, network_id, block_number, timestamp, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Transaction not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE transaction
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM transactions WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Transaction not found' });
    res.json({ message: 'Transaction deleted', transaction: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
