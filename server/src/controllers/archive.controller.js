import { Archive } from '../models/archive.model.js';
import { MilkEntry } from '../models/milk_entry.model.js';
import { asyncHandler, ApiError, ApiResponse } from '../utils/index.js';

const generateArchive = asyncHandler(async (req, res) => {
  let { month, year } = req.body;
  if (!month || !year) throw new ApiError(400, 'Month and Year are required');

  month = parseInt(month);
  year = parseInt(year);

  const existing = await Archive.findOne({ month, year });
  if (existing)
    throw new ApiError(400, 'Archive already exists for this period. Use Update instead.');

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const stats = await MilkEntry.aggregate([
    { $match: { date: { $gte: startDate, $lt: endDate } } },
    {
      $group: {
        _id: null,
        totalMilk: { $sum: '$dayTotalMilk' },
        totalAmount: { $sum: '$dayTotalAmount' },
      },
    },
  ]);

  if (!stats || stats.length === 0)
    throw new ApiError(404, 'No milk entries found to archive for this period');

  const now = new Date();
  const archivedAtUTC = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0)
  );

  const archive = await Archive.create({
    month,
    year,
    totalMilkPurchased: stats[0].totalMilk,
    totalBillAmount: stats[0].totalAmount,
    archivedAt: archivedAtUTC,
  });

  return res.status(201).json(new ApiResponse(201, archive, 'Archive created successfully'));
});

const updateArchive = asyncHandler(async (req, res) => {
  const { archiveId } = req.params;
  if (!archiveId) throw new ApiError(400, 'Arcive Id is required');

  const archiveData = await Archive.findById(archiveId);
  if (!archiveData) throw new ApiError(404, 'Archive is not found.');

  let month = archiveData.month;
  let year = archiveData.year;
  month = parseInt(month);
  year = parseInt(year);

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const latestStats = await MilkEntry.aggregate([
    { $match: { date: { $gte: startDate, $lt: endDate } } },
    {
      $group: {
        _id: null,
        totalMilk: { $sum: '$dayTotalMilk' },
        totalAmount: { $sum: '$dayTotalAmount' },
      },
    },
  ]);

  if (!latestStats || latestStats.length === 0)
    throw new ApiError(404, 'No entries found. Cannot update archive with empty data.');

  const now = new Date();
  const archivedAtUTC = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0)
  );

  const archive = await Archive.findOneAndUpdate(
    { month, year },
    {
      totalMilkPurchased: latestStats[0].totalMilk,
      totalBillAmount: latestStats[0].totalAmount,
      archivedAt: archivedAtUTC,
    },
    { new: true }
  );

  if (!archive) throw new ApiError(404, 'Original archive not found. Please generate first.');

  return res.status(200).json(new ApiResponse(200, archive, 'Archive updated successfully'));
});

const deleteArchiveById = asyncHandler(async (req, res) => {
  const { archiveId } = req.params;
  if (!archiveId) throw new ApiError(400, 'Archive ID is required');

  const deletedArchive = await Archive.findByIdAndDelete(archiveId);
  if (!deletedArchive) throw new ApiError(404, 'Archive not found or already deleted');

  return res.status(200).json(new ApiResponse(200, {}, 'Archive record deleted successfully'));
});

const getAllArchives = asyncHandler(async (_, res) => {
  const archives = await Archive.find({}).sort({ year: -1, month: -1 });
  if (!archives) throw new ApiError(404, 'Archive not found');
  return res
    .status(200)
    .json(new ApiResponse(200, archives, `${archives.length} archives retrieved.`));
});

export { generateArchive, updateArchive, getAllArchives, deleteArchiveById };
