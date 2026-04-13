import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { ApiError } from '../utils/index.js';

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
      lowercase: true,
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
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw new ApiError(401, error.message);
  }
});

userSchema.methods.isPasswordCorrect = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    return false;
  }
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      role: this.role,
    },
    process.env.ACCESSTOKEN_SECRET_KEY,
    {
      expiresIn: process.env.ACCESSTOKEN_EXPIRE,
    }
  );
};

export const User = mongoose.model('User', userSchema);
