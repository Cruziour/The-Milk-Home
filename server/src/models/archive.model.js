import mongoose from 'mongoose';

const archiveSchema = new mongoose.Schema(
  {
    month: {
      type: Number,
      required: true, // 1 to 12
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
      min: 2000,
    },
    totalMilkPurchased: {
      type: Number,
      default: 0, // Sabhi farmers ka total Litres
    },
    totalBillAmount: {
      type: Number, // Sabhi farmers ka total banne wala paisa
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

archiveSchema.index({ month: 1, year: 1 }, { unique: true });

export const Archive = mongoose.model('Archive', archiveSchema);
