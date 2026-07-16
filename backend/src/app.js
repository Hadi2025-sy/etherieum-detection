const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const walletRoutes = require('./routes/walletRoutes');
const walletAnalysisRoutes = require('./routes/walletanalysis');
const transactionRoutes = require('./routes/transactionRoutes');
const networkRoutes = require('./routes/networkRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.get('/', (req, res) => {
  res.json({ message: 'Ethereum Fraud Detection API is running' });
});

app.use('/api/wallets', apiLimiter, walletRoutes);
app.use('/api/analyses', apiLimiter, walletAnalysisRoutes);
app.use('/api/transactions', apiLimiter, transactionRoutes);
app.use('/api/networks', apiLimiter, networkRoutes);
app.use('/api/users', apiLimiter, userRoutes);

module.exports = app;