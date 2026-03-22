const express = require('express');
const router = express.Router();
const { getEvents, addEvent, deleteEvent } = require('../controllers/eventController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, getEvents);
router.post('/', auth, addEvent);
router.delete('/:id', auth, deleteEvent);

module.exports = router;
