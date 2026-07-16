const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all transactions
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM transactions ORDER BY block_time DESC NULLS LAST'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET transaction by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM transactions WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create transaction
router.post('/', async (req, res) => {
  try {
    const {
      analysis_id = null,
      snapshot_id = null,
      tx_hash,
      from_address,
      to_address = null,
      value_eth = null,
      gas_price_gwei = null,
      gas_used = null,
      block_number = null,
      block_time = null,
      is_internal = false,
      method_id = null,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO transactions (
        analysis_id, snapshot_id, tx_hash, from_address, to_address,
        value_eth, gas_price_gwei, gas_used, block_number, block_time,
        is_internal, method_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        analysis_id, snapshot_id, tx_hash, from_address, to_address,
        value_eth, gas_price_gwei, gas_used, block_number, block_time,
        is_internal, method_id,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update transaction
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      analysis_id = null,
      snapshot_id = null,
      from_address,
      to_address = null,
      value_eth = null,
      gas_price_gwei = null,
      gas_used = null,
      block_number = null,
      block_time = null,
      is_internal = false,
      method_id = null,
    } = req.body;

    const result = await pool.query(
      `UPDATE transactions
       SET analysis_id = $1, snapshot_id = $2, from_address = $3,
           to_address = $4, value_eth = $5, gas_price_gwei = $6, gas_used = $7,
           block_number = $8, block_time = $9, is_internal = $10, method_id = $11
       WHERE id = $12
       RETURNING *`,
      [
        analysis_id, snapshot_id, from_address, to_address,
        value_eth, gas_price_gwei, gas_used, block_number, block_time,
        is_internal, method_id, id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE transaction
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM transactions WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
