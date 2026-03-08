const express = require('express');
const router = express.Router();
const { suggestCategory } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/suggest-category', protect, suggestCategory);

module.exports = router;