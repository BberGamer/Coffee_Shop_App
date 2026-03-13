const express = require('express');
const { getAdminStats } = require('../controllers/dashboard.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/stats', protect, adminOnly, getAdminStats);

module.exports = router;
