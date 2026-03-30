import { User } from '../models/user.model.js';
import { ApiError, ApiResponse, asyncHandler } from '../utils/index.js';

// register user
const registerVendor = asyncHandler(async (req, res) => {
  const { name, slNo, password, phone, milkType } = req.body;
  if (!name || !slNo || !password || !phone || !milkType) {
    throw new ApiError(400, 'All fields are required');
  }
  const parsedSlNo = parseInt(slNo);
  if (isNaN(parsedSlNo) || parsedSlNo <= 0) {
    throw new ApiError(
      400,
      'Invalid SL No: It must be a positive number (cannot be 0, null, or empty)'
    );
  }
  const existingUser = await User.findOne({ slNo });

  // check if an active user already has this slNo
  if (existingUser?.isActive) {
    throw new ApiError(409, 'ConflictL Sl No is already assigned to an active user');
  }

  // check if an inactive user has this slno
  if (existingUser && !existingUser?.isActive && existingUser.slNo) {
    existingUser.slNo = null;
    await existingUser.save();
  }
  try {
    // register new user
    const newUser = await User.create({
      slNo,
      name,
      password,
      phone,
      milkType,
      isActive: true,
    });
    res
      .status(201)
      .json(
        new ApiResponse(201, newUser, 'Success: User registered successfully and SL No assigned.')
      );
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, 'SL No already assigned');
    }
    throw new ApiError(
      500,
      error.message || 'Internal Server Error: Could not complete registration at this time.'
    );
  }
});

// update user status
const updateUserStatus = asyncHandler(async (req, res) => {
  const { slNo, userId, isActive } = req.body;
  if (!slNo || !userId || isActive === undefined) {
    throw new ApiError(400, 'Error: User ID, Sl NO and Status are required.');
  }
  const parsedSlNo = parseInt(slNo);
  if (isNaN(parsedSlNo) || parsedSlNo <= 0) {
    throw new ApiError(
      400,
      'Invalid SL No: It must be a positive number (cannot be 0, null, or empty)'
    );
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, `User not found with the provided ID.`);
    }

    // case 1: deactivating
    if (isActive === 'false') {
      user.slNo = null;
      user.isActive = false;
    } // case 2: Activating User
    else if (isActive === 'true') {
      const alreadyTaken = await User.findOne({
        slNo: parsedSlNo,
        isActive: true,
        _id: { $ne: userId },
      });
      if (alreadyTaken) {
        throw new ApiError(409, 'Conflict: This SL No is already assigned to another active user.');
      }
      await User.updateMany({ slNo: parsedSlNo, isActive: false }, { $set: { slNo: null } });
      user.slNo = parsedSlNo;
      user.isActive = true;
    }
    await user.save();
    const updatedUser = await User.findById(userId);
    return res
      .status(200)
      .json(new ApiResponse(200, updatedUser, 'User status changed successfully'));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, error.message || 'Something went wrong while updating user status');
  }
});

// login user
const loginUser = asyncHandler(async (req, res) => {
  const { slNo, password } = req.body;
  if (!slNo || !password) {
    throw new ApiError(400, 'Please fill all details.');
  }
  const parsedSlNo = parseInt(slNo);
  if (isNaN(parsedSlNo) || parsedSlNo <= 0) {
    throw new ApiError(
      400,
      'Invalid SL No: It must be a positive number (cannot be 0, null, or empty)'
    );
  }
  try {
    const user = await User.findOne({ slNo: parsedSlNo });
    if (!user) {
      throw new ApiError(404, 'User not found: No account associated with this SL No.');
    }
    if (!user.isActive) {
      throw new ApiError(
        403,
        'Access Denied: Your account is currently inactive. Please contact Admin.'
      );
    }
    if (user.password !== password) {
      throw new ApiError(401, 'Invalid credentials: The password you entered is incorrect');
    }
    const loggedInUser = user.toObject();
    delete loggedInUser.password;
    return res.status(200).json(new ApiResponse(200, loggedInUser, 'Success Login'));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, error.message || 'An unexpected error occurred during login.');
  }
});

// get all users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res
      .status(200)
      .json(new ApiResponse(200, users, 'Success: All users retrieved successfully'));
  } catch (error) {
    throw new ApiError(500, error.message || 'An unexpected error occurred while fetching users.');
  }
});

export { registerVendor, updateUserStatus, loginUser, getAllUsers };
