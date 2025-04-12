const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { createEve, getEve, updateEve, deleteEve} = require('../controllers/evenementController');
const router = express.Router();
router.post('/events', authRoute, create);
router.get('/events', authRoute, afficherEve);
router.get('/events/:id', afficherEve);
module.exports = router;