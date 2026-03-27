import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  paidAmount: {
    type: Number,
    default: 0,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  remark: {
    type: String,
    default: 'Cash Payment',
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

export const Payment = mongoose.model('Payment', paymentSchema);
