const express = require('express');
const router = express.Router();
const pool = require('../config/db');

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
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM wallets WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create wallet
router.post('/', async (req, res) => {
  try {
    const {
      address,
      network = null,
      entity_type = null,
      is_exchange = false,
      is_contract = false,
      total_received_eth = null,
      total_sent_eth = null,
      transaction_count = null,
      first_seen = null,
      last_seen = null,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO wallets (address, network, entity_type, is_exchange, is_contract,
        total_received_eth, total_sent_eth, transaction_count, first_seen, last_seen)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        address, network, entity_type, is_exchange, is_contract,
        total_received_eth, total_sent_eth, transaction_count, first_seen, last_seen,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update wallet
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      network = null,
      entity_type = null,
      is_exchange = false,
      is_contract = false,
      total_received_eth = null,
      total_sent_eth = null,
      transaction_count = null,
      first_seen = null,
      last_seen = null,
    } = req.body;

    const result = await pool.query(
      `UPDATE wallets
       SET network = $1, entity_type = $2, is_exchange = $3,
           is_contract = $4, total_received_eth = $5, total_sent_eth = $6,
           transaction_count = $7, first_seen = $8, last_seen = $9
       WHERE id = $10
       RETURNING *`,
      [
        network, entity_type, is_exchange, is_contract,
        total_received_eth, total_sent_eth, transaction_count, first_seen, last_seen, id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE wallet
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM wallets WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    res.json({ message: 'Wallet deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
