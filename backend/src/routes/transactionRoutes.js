const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all transactions
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM transactions ORDER BY block_time DESC NULLS LAST, id DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create transaction
router.post('/', async (req, res) => {
  try {
    const {
      analysis_id,
      snapshot_id = null,
      tx_hash,
      from_address,
      to_address,
      value_eth = null,
      gas_price_gwei = null,
      gas_used = null,
      block_number = null,
      block_time = null,
      is_internal = false,
      method_id = null
    } = req.body;

    const result = await pool.query(
      `INSERT INTO transactions (
        analysis_id,
        snapshot_id,
        tx_hash,
        from_address,
        to_address,
        value_eth,
        gas_price_gwei,
        gas_used,
        block_number,
        block_time,
        is_internal,
        method_id
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *`,
      [
        analysis_id,
        snapshot_id,
        tx_hash,
        from_address,
        to_address,
        value_eth,
        gas_price_gwei,
        gas_used,
        block_number,
        block_time,
        is_internal,
        method_id
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;