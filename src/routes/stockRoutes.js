const express = require('express');
const router = express.Router();
const db = require('../models/db');
const authenticateToken = require('../middleware/authMiddleware');

// Import database functions
const { getStockByBranch } = require('../models/db');

// Example protected route using authentication middleware
router.get('/stock/:branch', authenticateToken, async (req, res) => {
    try {
        const branch = req.params.branch;
        const stockData = await getStockByBranch(branch);
        res.json(stockData);
    } catch (error) {
        console.error('Error fetching stock data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
