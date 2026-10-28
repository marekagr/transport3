const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema(
  {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    // car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    jos: { type: mongoose.Schema.Types.ObjectId, ref: 'Jos', required: true },
    target: { type: mongoose.Schema.Types.ObjectId, ref: 'Target', required: true },
    status: { type: mongoose.Schema.Types.ObjectId, ref: 'Status', required: true }
  },
  { timestamps: true }
);
calendarEventSchema.set('collection', 'calendarEvent');
module.exports = mongoose.model('CalendarEvent', calendarEventSchema,'calendarEvent');