const mongoose = require('mongoose');

const historySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    action: {
      type: String,
      required: true,
      enum: ['CREATED', 'UPDATED', 'DELETED', 'COMMENTED'],
    },
    details: {
      type: String,
      required: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
  },
  {
    timestamps: true,
  }
);

const History = mongoose.model('History', historySchema);
module.exports = History;
