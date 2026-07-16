const express = require('express');
require('dotenv').config();
const pool = require('./config/db');

const app = express();
app.use(express.json());

app.get('/api/health/db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS now');
    res.json({ ok: true, db_time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

const walletRoutes = require('./routes/walletRoutes');
app.use('/api/wallets', walletRoutes);

const walletAnalysisRoutes = require('./routes/walletanalysis');
app.use('/api/analyses', walletAnalysisRoutes);

const transactionRoutes = require('./routes/transactionRoutes');
app.use('/api/transactions', transactionRoutes);

const networkRoutes = require('./routes/networkRoutes');
app.use('/api/networks', networkRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});