const express = require('express');
const router = express.Router();
const CalendarEvent = require('../models/CalendarEvent');

// CREATE
router.post('/', async (req, res) => {
  try {
    const event = new CalendarEvent(req.body);
    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET ALL
router.get('/', async (req, res) => {
  try {
    let { start, end } = req.query;

    // If start or end are missing/null, default to the current month
    if (!start || !end) {
      const now = new Date();
      
      // First millisecond of the current month
      start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      
      // Last millisecond of the current month
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();
    }

    const query = {
      start: { $lte: new Date(end) },
      end: { $gte: new Date(start) }
    };
    const events = await CalendarEvent.find()
      .populate('jos')
      .populate('target')
      .populate('status');
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const updatedEvent = await CalendarEvent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEvent) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const deletedEvent = await CalendarEvent.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json({ message: 'Event deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;