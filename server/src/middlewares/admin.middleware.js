import { asyncHandler, ApiError } from '../utils/index.js';

const isAdmin = asyncHandler(async (req, _, next) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(401, 'Authentication required.');
  }
  if (user.role !== 'admin') {
    throw new ApiError(403, 'Access Denied: You do not have Admin privileges.');
  }
  next();
});

export default isAdmin;
