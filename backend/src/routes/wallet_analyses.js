const { Router } = require('express');
const pool = require('../config/db');

const router = Router();

function validateRiskScore(risk_score) {
  const score = Number(risk_score);
  if (isNaN(score) || score < 0 || score > 100) {
    return 'risk_score must be a number between 0 and 100';
  }
  return null;
}

// GET all wallet analyses
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM wallet_analyses ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET wallet analysis by id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM wallet_analyses WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Wallet analysis not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create wallet analysis
router.post('/', async (req, res) => {
  const { wallet_id, risk_score, is_fraud, analysis_notes, analyzed_at } = req.body;
  const validationError = validateRiskScore(risk_score);
  if (validationError) return res.status(400).json({ error: validationError });
  try {
    const result = await pool.query(
      'INSERT INTO wallet_analyses (wallet_id, risk_score, is_fraud, analysis_notes, analyzed_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [wallet_id, risk_score, is_fraud, analysis_notes, analyzed_at]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update wallet analysis
router.put('/:id', async (req, res) => {
  const { wallet_id, risk_score, is_fraud, analysis_notes, analyzed_at } = req.body;
  const validationError = validateRiskScore(risk_score);
  if (validationError) return res.status(400).json({ error: validationError });
  try {
    const result = await pool.query(
      'UPDATE wallet_analyses SET wallet_id = $1, risk_score = $2, is_fraud = $3, analysis_notes = $4, analyzed_at = $5 WHERE id = $6 RETURNING *',
      [wallet_id, risk_score, is_fraud, analysis_notes, analyzed_at, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Wallet analysis not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE wallet analysis
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM wallet_analyses WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Wallet analysis not found' });
    res.json({ message: 'Wallet analysis deleted', analysis: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
