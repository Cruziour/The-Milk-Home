import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { ApiError, asyncHandler } from '../utils/index.js';

const verifyJwt = asyncHandler(async (req, _, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(406, 'Unauthorized');
  }
  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = jwt.verify(token, process.env.ACCESSTOKEN_SECRET_KEY);
    if (!decodedToken) {
      throw new ApiError(406, 'Access denied. Invalid token.');
    }
    const user = await User.findById(decodedToken?._id).select('-password');
    if (!user) {
      throw new ApiError(406, 'Unauthorized');
    }
    if (!user.isActive && user.role === 'vendor') {
      throw new ApiError(
        403,
        'Access Denied: Your account is currently inactive. Please contact Admin.'
      );
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(406, error?.message || 'Invalid access token');
  }
});

export default verifyJwt;
