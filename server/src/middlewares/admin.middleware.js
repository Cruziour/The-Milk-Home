import { User } from '../models/user.model.js';
import { asyncHandler, ApiError } from '../utils/index.js';

const isAdmin = asyncHandler(async (req, _, next) => {
  try {
    const { userId } = req.body;
    if (!adminId) {
      throw new ApiError(400, 'Admin ID is required to verify permissions.');
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'Admin account not found.');
    }
    if (user.role !== 'admin') {
      throw new ApiError(403, 'Access Denied: You do not have Admin privileges.');
    }
    req.user = user; // Attach user info to the request object for further use
    next();
  } catch (error) {
    next(error);
  }
});

export default isAdmin;
