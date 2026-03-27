import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slNo: {
      type: Number,
      default: null,
      validate: {
        validator: function (v) {
          return v === null || (Number.isInteger(v) && v > 0);
        },
        message: 'SL No must be a positive number and cannot be zero.',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    milkType: {
      type: String,
      enum: ['cow', 'buffalo', 'both'],
      required: [true, 'Milk type is required'],
      default: 'cow',
    },
    role: {
      type: String,
      enum: ['admin', 'vendor'],
      default: 'vendor',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
