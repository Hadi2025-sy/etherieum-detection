const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all wallet analyses
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM wallet_analyses ORDER BY started_at DESC NULLS LAST'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create wallet analysis
router.post('/', async (req, res) => {
  try {
    const {
      user_id,
      wallet_id,
      status = 'pending',
      trigger_type = 'manual',
      started_at = null,
      completed_at = null,
      tx_count_analyzed = 0
    } = req.body;

    const result = await pool.query(
      `INSERT INTO wallet_analyses (
        user_id, wallet_id, status, trigger_type, started_at, completed_at, tx_count_analyzed
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        user_id,
        wallet_id,
        status,
        trigger_type,
        started_at,
        completed_at,
        tx_count_analyzed
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;