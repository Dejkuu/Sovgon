const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lotterySchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  person: {
    type: String,
    required: true,
  },
  personID: {
    type: mongoose.Decimal128,
    required: true,
  },
  isSender: {
    type: Boolean,
    default: false,
  },
  isRecipient: {
    type: Boolean,
    default: false,
  },
});

const Lottery = mongoose.model('Lottery', lotterySchema);
module.exports = Lottery;