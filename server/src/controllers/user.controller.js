import { User } from '../models/user.model.js';
import { ApiError, ApiResponse, asyncHandler } from '../utils/index.js';

// register user
const registerVendor = asyncHandler(async (req, res) => {
  const { slNo, name, mobile, password, address, milkType } = req.body;
  if (!name || !slNo || !password || !mobile || !milkType || !address) {
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
      phone: mobile,
      milkType,
      isActive: true,
      address,
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

const updateUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { slNo, name, isActive, address, phone, milkType } = req.body;

  if (!id) throw new ApiError(400, 'User ID is required.');

  const user = await User.findById(id);
  if (!user) throw new ApiError(404, 'User not found.');

  const status = isActive === 'true' || isActive === true;

  if (status === false) {
    // --- CASE: DEACTIVATE USER ---
    user.isActive = false;
    user.slNo = null;
  } else {
    const parsedSlNo = parseInt(slNo);
    if (!parsedSlNo || isNaN(parsedSlNo)) {
      throw new ApiError(400, 'Active user must have a valid Serial Number.');
    }

    // Check if this SL No is already taken by ANOTHER ACTIVE user
    const alreadyTaken = await User.findOne({
      slNo: parsedSlNo,
      isActive: true,
      _id: { $ne: id },
    });

    if (alreadyTaken) {
      throw new ApiError(
        409,
        `Conflict: SL No ${parsedSlNo} is already assigned to ${alreadyTaken.name}`
      );
    }

    await User.updateMany({ slNo: parsedSlNo, isActive: false }, { $set: { slNo: null } });

    user.slNo = parsedSlNo;
    user.isActive = true;
  }

  // Common Fields Update (Admin can change these anytime)
  if (name) user.name = name;
  if (address) user.address = address;
  if (phone) user.phone = phone;
  if (milkType) user.milkType = milkType;

  await user.save();

  const updatedUser = await User.findById(id).select('-password');
  return res.status(200).json(new ApiResponse(200, updatedUser, 'Vendor updated successfully'));
});

// login user
const loginUser = asyncHandler(async (req, res) => {
  const { slNo, password } = req.body;
  if (!slNo || !password) {
    throw new ApiError(400, 'Please fill all details.');
  }

  let query = {};
  if (typeof slNo === 'string' && slNo.toLowerCase().trim() === 'admin') {
    query = { role: 'admin' };
  } else {
    const parsedSlNo = parseInt(slNo);
    if (isNaN(parsedSlNo) || parsedSlNo <= 0) {
      throw new ApiError(
        400,
        'Invalid SL No: It must be a positive number (cannot be 0, null, or empty)'
      );
    }
    query = { slNo: parsedSlNo };
  }

  try {
    const user = await User.findOne(query);
    if (!user) {
      throw new ApiError(404, 'User not found: No account associated with this SL No.');
    }
    if (!user.isActive && user.role === 'vendor') {
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

const getUserBySlNoAndName = asyncHandler(async (req, res) => {
  const { slNo } = req.params;
  if (!slNo) {
    throw new ApiError(400, 'Please fill all details.');
  }
  const isNumber = /^\d+$/.test(slNo);
  let query;
  if (isNumber) {
    const parsedSlNo = parseInt(slNo);
    query = { slNo: parsedSlNo };
  } else {
    query = { name: { $regex: slNo, $options: 'i' } };
  }
  try {
    const user = await User.find(query).select('-password');
    if (!user) {
      throw new ApiError(404, 'User not found: No account associated with this SL No or Name.');
    }
    return res.status(200).json(new ApiResponse(200, user, 'Success: User retrieved successfully'));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, error.message || 'An unexpected error occurred while fetching user.');
  }
});

export { registerVendor, updateUserStatus, loginUser, getAllUsers, getUserBySlNoAndName };
