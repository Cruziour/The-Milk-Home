import mongoose from 'mongoose';

const archiveSchema = new mongoose.Schema(
  {
    month: {
      type: Number,
      required: true,
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
      default: 0,
    },
    totalBillAmount: {
      type: Number,
      default: 0,
    },
    archivedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

archiveSchema.index({ month: 1, year: 1 }, { unique: true });

export const Archive = mongoose.model('Archive', archiveSchema);
