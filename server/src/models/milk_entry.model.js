import mongoose from 'mongoose';

const milkEntrySchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  morning: {
    qty: {
      type: Number,
      default: 0,
    },
    amount: {
      type: Number,
      default: 0,
    },
  },
  evening: {
    qty: {
      type: Number,
      default: 0,
    },
    amount: {
      type: Number,
      default: 0,
    },
  },
  dayTotalAmount: {
    type: Number,
    default: 0,
  },
  dayTotalMilk: {
    type: Number,
    default: 0,
  },
});

milkEntrySchema.pre('save', function () {
  this.dayTotalAmount = (this.morning.amount || 0) + (this.evening.amount || 0);
  this.dayTotalMilk = (this.morning.qty || 0) + (this.evening.qty || 0);
});

export const MilkEntry = mongoose.model('MilkEntry', milkEntrySchema);
