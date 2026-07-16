const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all wallets
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM wallets ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create wallet
router.post('/', async (req, res) => {
  try {
    const {
      address,
      network = 'ethereum',
      entity_type = null,
      is_exchange = false,
      is_contract = false,
      total_received_eth = null,
      total_sent_eth = null,
      transaction_count = 0,
      first_seen = null,
      last_seen = null
    } = req.body;

    const result = await pool.query(
      `INSERT INTO wallets (
        address, network, entity_type, is_exchange, is_contract,
        total_received_eth, total_sent_eth, transaction_count,
        first_seen, last_seen
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *`,
      [
        address,
        network,
        entity_type,
        is_exchange,
        is_contract,
        total_received_eth,
        total_sent_eth,
        transaction_count,
        first_seen,
        last_seen
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;