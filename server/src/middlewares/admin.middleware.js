import { User } from '../models/user.model.js';
import { asyncHandler, ApiError } from '../utils/index.js';

const isAdmin = asyncHandler(async (req, _, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Admin ID is required to verify permissions.');
    }
    const adminId = authHeader.split(' ')[1];

    if (!adminId) {
      throw new ApiError(400, 'Invalid Authorization header format.');
    }
    const user = await User.findById(adminId);
    if (!user) {
      throw new ApiError(404, 'Admin account not found.');
    }
    if (user.role !== 'admin') {
      throw new ApiError(403, 'Access Denied: You do not have Admin privileges.');
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
});

export default isAdmin;
