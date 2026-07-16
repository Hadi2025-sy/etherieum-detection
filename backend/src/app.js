const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const usersRouter = require('./routes/users');
const networksRouter = require('./routes/networks');
const walletsRouter = require('./routes/wallets');
const walletAnalysesRouter = require('./routes/wallet_analyses');
const transactionsRouter = require('./routes/transactions');

const app = express();

app.use(cors());
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' },
});

app.get('/', (req, res) => {
  res.json({ message: 'Ethereum Fraud Detection API is running' });
});

app.use('/api/users', apiLimiter, usersRouter);
app.use('/api/networks', apiLimiter, networksRouter);
app.use('/api/wallets', apiLimiter, walletsRouter);
app.use('/api/analyses', apiLimiter, walletAnalysesRouter);
app.use('/api/transactions', apiLimiter, transactionsRouter);

module.exports = app;