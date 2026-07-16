const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all users
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM users ORDER BY created_at DESC NULLS LAST'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET user by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create user
router.post('/', async (req, res) => {
  try {
    const {
      email,
      password_hash,
      full_name = null,
      role = 'user',
      is_active = true,
      is_verified = false,
      last_login = null,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, role, is_active, is_verified, last_login)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [email, password_hash, full_name, role, is_active, is_verified, last_login]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      email,
      password_hash,
      full_name = null,
      role = 'user',
      is_active = true,
      is_verified = false,
      last_login = null,
    } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET email = $1, password_hash = $2, full_name = $3, role = $4,
           is_active = $5, is_verified = $6, last_login = $7
       WHERE id = $8
       RETURNING *`,
      [email, password_hash, full_name, role, is_active, is_verified, last_login, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
