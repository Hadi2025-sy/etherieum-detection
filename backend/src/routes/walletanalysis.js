const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all analyses
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM wallet_analyses ORDER BY created_at DESC NULLS LAST'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET analysis by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM wallet_analyses WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create analysis
router.post('/', async (req, res) => {
  try {
    const {
      user_id = null,
      wallet_id = null,
      status = 'pending',
      trigger_type = null,
      tx_count_analyzed = null,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO wallet_analyses (user_id, wallet_id, status, trigger_type, tx_count_analyzed)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user_id, wallet_id, status, trigger_type, tx_count_analyzed]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update analysis
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      user_id = null,
      wallet_id = null,
      status = 'pending',
      trigger_type = null,
      tx_count_analyzed = null,
    } = req.body;

    const result = await pool.query(
      `UPDATE wallet_analyses
       SET user_id = $1, wallet_id = $2, status = $3, trigger_type = $4,
           tx_count_analyzed = $5
       WHERE id = $6
       RETURNING *`,
      [user_id, wallet_id, status, trigger_type, tx_count_analyzed, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE analysis
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM wallet_analyses WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.json({ message: 'Analysis deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
