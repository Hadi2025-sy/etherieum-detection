const express = require('express');
const cors = require('cors');

const walletRoutes = require('./routes/walletRoutes');
const walletAnalysisRoutes = require('./routes/walletanalysis');
const transactionRoutes = require('./routes/transactionRoutes');
const networkRoutes = require('./routes/networkRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Ethereum Fraud Detection API is running' });
});

app.use('/api/wallets', walletRoutes);
app.use('/api/analyses', walletAnalysisRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/networks', networkRoutes);
app.use('/api/users', userRoutes);

module.exports = app;