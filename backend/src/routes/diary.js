const express = require('express');
const router = express.Router();
const diaryController = require('../controllers/diaryController');

// GET /api/diary - Get all entries for user
router.get('/', diaryController.getEntries);

// GET /api/diary/:id - Get single entry by ID
router.get('/:id', diaryController.getEntryById);

// POST /api/diary - Create new entry
router.post('/', diaryController.createEntry);

// DELETE /api/diary/:id - Delete entry
router.delete('/:id', diaryController.deleteEntry);

module.exports = router;
