const express = require('express');
const router = express.Router();
const searchControllers = require('../controllers/search');

router.get('/search', searchControllers.getSearchedInfo);

module.exports = router;