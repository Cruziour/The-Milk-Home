import { asyncHandler, ApiError } from '../utils/index.js';

const isAdmin = asyncHandler(async (req, _, next) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(406, 'Authentication required.');
  }
  if (user.role !== 'admin') {
    throw new ApiError(406, 'Access Denied: You do not have Admin privileges.');
  }
  next();
});

export default isAdmin;
