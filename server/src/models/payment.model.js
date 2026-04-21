import mongoose, { Schema } from 'mongoose';

const paymentSchema = new Schema(
  {
    vendor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    slNo: { type: Number, required: true },
    amount: { type: Number, required: true },
    remark: { type: String, default: 'Cash Payment' },
    month: { type: Number, required: true }, // 1 to 12
    year: { type: Number, required: true },
    voucherId: { type: String, unique: true, required: true },
    paymentDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Payment = mongoose.model('Payment', paymentSchema);
