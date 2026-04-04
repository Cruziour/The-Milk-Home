import { MilkEntry } from '../models/milk_entry.model.js';
import { User } from '../models/user.model.js';
import { ApiError, asyncHandler, ApiResponse } from '../utils/index.js';
import mongoose from 'mongoose';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit-table';

const addMilkEntry = asyncHandler(async (req, res) => {
  const { slNo, date, morningQty, morningAmount, eveningQty, eveningAmount } = req.body;
  if (
    !date ||
    !slNo ||
    morningQty == null ||
    morningAmount == null ||
    eveningQty == null ||
    eveningAmount == null
  ) {
    throw new ApiError(400, 'All fields are required');
  }
  const parsedSlNo = parseInt(slNo);
  if (isNaN(parsedSlNo) || parsedSlNo <= 0) {
    throw new ApiError(
      400,
      'Invalid SL No: It must be a positive number (cannot be null or empty)'
    );
  }
  const parsedFloatMorningQty = parseFloat(morningQty);
  const parsedFloatMorningAmount = parseFloat(morningAmount);
  const parsedFloatEveningQty = parseFloat(eveningQty);
  const parsedFloatEveningAmount = parseFloat(eveningAmount);
  if (
    isNaN(parsedFloatMorningQty) ||
    isNaN(parsedFloatMorningAmount) ||
    isNaN(parsedFloatEveningQty) ||
    isNaN(parsedFloatEveningAmount)
  ) {
    throw new ApiError(
      400,
      'Invalid input: Morning and Evening quantities and amounts must be valid numbers'
    );
  }
  const inputDate = new Date(date);
  const entryDate = new Date(
    Date.UTC(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate(), 12, 0, 0)
  );
  try {
    const user = await User.findOne({ slNo: parsedSlNo, isActive: true });
    if (!user) {
      throw new ApiError(404, 'User not found with the provided SL No');
    }
    const existingEntry = await MilkEntry.findOne({ vendor: user._id, date: entryDate });
    if (existingEntry) {
      throw new ApiError(409, 'Milk entry already exists for this user on the specified date');
    }
    const milkEntry = new MilkEntry({
      vendor: user._id,
      date: entryDate,
      morning: {
        qty: parsedFloatMorningQty,
        amount: parsedFloatMorningAmount,
      },
      evening: {
        qty: parsedFloatEveningQty,
        amount: parsedFloatEveningAmount,
      },
    });
    await milkEntry.save();
    return res.status(201).json(new ApiResponse(201, milkEntry, 'Milk entry added successfully'));
  } catch (error) {
    throw new ApiError(500, error.message || 'Error occurred while adding milk entry');
  }
});

const updateMilkEntry = asyncHandler(async (req, res) => {
  const { entryId } = req.params;
  const { morningQty, morningAmount, eveningQty, eveningAmount } = req.body;

  if (!mongoose.Types.ObjectId.isValid(entryId)) {
    throw new ApiError(400, 'Invalid entry ID');
  }

  try {
    const id = new mongoose.Types.ObjectId(entryId);
    const milkEntry = await MilkEntry.findById(id);

    if (!milkEntry) {
      throw new ApiError(404, 'Milk entry not found');
    }

    // Update values
    if (morningQty !== undefined) milkEntry.morning.qty = parseFloat(morningQty);
    if (morningAmount !== undefined) milkEntry.morning.amount = parseFloat(morningAmount);
    if (eveningQty !== undefined) milkEntry.evening.qty = parseFloat(eveningQty);
    if (eveningAmount !== undefined) milkEntry.evening.amount = parseFloat(eveningAmount);

    // Save will trigger pre-save hook for dayTotalAmount and dayTotalMilk
    await milkEntry.save();

    return res.status(200).json(new ApiResponse(200, milkEntry, 'Milk entry updated successfully'));
  } catch (error) {
    throw new ApiError(500, error.message || 'Error occurred while updating milk entry');
  }
});

const getMilkEntries = asyncHandler(async (req, res) => {
  const { month, year } = req.query; // Query parameters for month and year
  if (!month || !year) {
    throw new ApiError(400, 'Month and Year query parameters are required');
  }
  const parsedMonth = parseInt(month);
  const parsedYear = parseInt(year);
  if (isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
    throw new ApiError(400, 'Invalid month: It must be a number between 1 and 12');
  }
  if (isNaN(parsedYear) || parsedYear < 1900 || parsedYear > 2100) {
    throw new ApiError(
      400,
      'Invalid year: It must be a reasonable number (e.g., between 1900 and 2100)'
    );
  }
  // Date range set karein (Mahine ki 1st date se agle mahine ki 1st date tak)
  const startDate = new Date(parsedYear, parsedMonth - 1, 1);
  const endDate = new Date(parsedYear, parsedMonth, 1);
  try {
    const entries = await MilkEntry.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $lookup: {
          from: 'users', // Collection name in MongoDB
          localField: 'vendor',
          foreignField: '_id',
          as: 'vendorDetails',
        },
      },
      {
        $unwind: '$vendorDetails',
      },
      {
        $project: {
          _id: 1,
          date: 1,
          morning: 1,
          evening: 1,
          dayTotalMilk: 1,
          dayTotalAmount: 1,
          vendor: {
            _id: '$vendorDetails._id',
            slNo: '$vendorDetails.slNo',
            name: '$vendorDetails.name',
            role: '$vendorDetails.role',
            milkType: '$vendorDetails.milkType',
            address: '$vendorDetails.address',
          },
        },
      },
      {
        $sort: { date: 1 }, // Date ke hisaab se ascending order mein sort karein
      },
    ]);
    return res.status(200).json(new ApiResponse(200, entries, 'Milk entries fetched successfully'));
  } catch (error) {
    throw new ApiError(500, error.message || 'Error occurred while fetching milk entries');
  }
});

const getMilkEntriesBySlNo = asyncHandler(async (req, res) => {
  const { slNo, month, year } = req.query;
  if (!slNo || !month || !year) {
    throw new ApiError(400, 'SL No, Month, and Year parameters are required');
  }
  const parsedSlNo = parseInt(slNo);
  const parsedMonth = parseInt(month);
  const parsedYear = parseInt(year);
  if (isNaN(parsedSlNo) || parsedSlNo <= 0) {
    throw new ApiError(
      400,
      'Invalid SL No: It must be a positive number (cannot be null or empty)'
    );
  }
  if (isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
    throw new ApiError(400, 'Invalid month: It must be a number between 1 and 12');
  }
  if (isNaN(parsedYear) || parsedYear < 1900 || parsedYear > 2100) {
    throw new ApiError(
      400,
      'Invalid year: It must be a reasonable number (e.g., between 1900 and 2100)'
    );
  }
  const startDate = new Date(parsedYear, parsedMonth - 1, 1);
  const endDate = new Date(parsedYear, parsedMonth, 1);
  try {
    const user = await User.findOne({ slNo: parsedSlNo, isActive: true });
    if (!user) {
      throw new ApiError(404, 'User not found with the provided SL No');
    }
    const entries = await MilkEntry.aggregate([
      {
        $match: {
          vendor: new mongoose.Types.ObjectId(user._id),
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'vendor',
          foreignField: '_id',
          as: 'vendorDetails',
        },
      },
      {
        $unwind: '$vendorDetails',
      },
      {
        $project: {
          _id: 1,
          date: 1,
          morning: 1,
          evening: 1,
          dayTotalMilk: 1,
          dayTotalAmount: 1,
          vendor: {
            _id: '$vendorDetails._id',
            slNo: '$vendorDetails.slNo',
            name: '$vendorDetails.name',
            role: '$vendorDetails.role',
            milkType: '$vendorDetails.milkType',
            address: '$vendorDetails.address',
          },
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);
    const totalSummary = entries.reduce(
      (acc, entry) => {
        acc.morningQty += entry.morning.qty;
        acc.morningAmount += entry.morning.amount;
        acc.eveningQty += entry.evening.qty;
        acc.eveningAmount += entry.evening.amount;
        return acc;
      },
      { morningQty: 0, morningAmount: 0, eveningQty: 0, eveningAmount: 0 }
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { entries, totalSummary },
          `Farmer's monthly ledger fetched successfully.`
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message || 'Error occurred while fetching milk entries');
  }
});

const exportMilkEntries = asyncHandler(async (req, res) => {
  const { slNo, month, year, format } = req.query;

  if (!month || !year || !format) {
    throw new ApiError(400, 'Month, Year, and Format query parameters are required');
  }
  const parsedMonth = parseInt(month);
  const parsedYear = parseInt(year);
  if (isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
    throw new ApiError(400, 'Invalid month: It must be a number between 1 and 12');
  }
  if (isNaN(parsedYear) || parsedYear < 1900 || parsedYear > 2100) {
    throw new ApiError(
      400,
      'Invalid year: It must be a reasonable number (e.g., between 1900 and 2100)'
    );
  }
  const startDate = new Date(parsedYear, parsedMonth - 1, 1);
  const endDate = new Date(parsedYear, parsedMonth, 1);
  let matchQuery = {
    date: { $gte: startDate, $lt: endDate },
  };
  let user = null;
  if (slNo && slNo !== undefined) {
    const parsedSlNo = parseInt(slNo);
    if (isNaN(parsedSlNo) || parsedSlNo <= 0) {
      throw new ApiError(
        400,
        'Invalid SL No: It must be a positive number (cannot be null or empty)'
      );
    }
    user = await User.findOne({ slNo: parsedSlNo, isActive: true });
    if (!user) {
      throw new ApiError(404, 'User not found with the provided SL No');
    }
    matchQuery.vendor = new mongoose.Types.ObjectId(user._id);
  }
  try {
    const entries = await MilkEntry.aggregate([
      {
        $match: matchQuery,
      },
      {
        $lookup: {
          from: 'users',
          localField: 'vendor',
          foreignField: '_id',
          as: 'vendorDetails',
        },
      },
      {
        $unwind: '$vendorDetails',
      },
      {
        $project: {
          _id: 1,
          date: 1,
          morning: 1,
          evening: 1,
          dayTotalMilk: 1,
          dayTotalAmount: 1,
          vendor: {
            _id: '$vendorDetails._id',
            slNo: '$vendorDetails.slNo',
            name: '$vendorDetails.name',
            role: '$vendorDetails.role',
            milkType: '$vendorDetails.milkType',
          },
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);
    if (entries.length === 0) {
      throw new ApiError(404, 'No milk entries found for the specified criteria');
    }
    // 3. Calculate Totals for Grand Total Row
    const totals = entries.reduce(
      (acc, curr) => {
        acc.mQty += curr.morning.qty;
        acc.mAmt += curr.morning.amount;
        acc.eQty += curr.evening.qty;
        acc.eAmt += curr.evening.amount;
        acc.tMilk += curr.dayTotalMilk;
        acc.tAmt += curr.dayTotalAmount;
        return acc;
      },
      { mQty: 0, mAmt: 0, eQty: 0, eAmt: 0, tMilk: 0, tAmt: 0 }
    );

    const fileName = user
      ? `milk_entries_${user.slNo}_${month}_${year}`
      : `milk_entries_${month}_${year}`;

    if (format === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Milk Report');

      // Center Header
      worksheet.mergeCells('A1', 'J1');
      const title = worksheet.getCell('A1');
      title.value = 'KISHAN MILK COLLECTION CENTER';
      title.font = { name: 'Arial Black', size: 16, bold: true, color: { argb: 'FFFF0000' } };
      title.alignment = { vertical: 'middle', horizontal: 'center' };

      worksheet.mergeCells('A2', 'J2');
      worksheet.getCell('A2').value = user
        ? `Farmer: ${user.name} (${user.slNo}) | Type: ${user.milkType || 'N/A'}`
        : 'All Farmers';
      worksheet.getCell('A2').alignment = { horizontal: 'center' };

      // Column Setup
      const colHeaders = [
        { header: 'Date', key: 'date', width: 12 },
        { header: 'SL', key: 'slNo', width: 8 },
        { header: 'Name', key: 'name', width: 20 },
        { header: 'Type', key: 'type', width: 10 },
        { header: 'Morning.Qty', key: 'mQty', width: 18 },
        { header: 'Morning.Amt', key: 'mAmt', width: 18 },
        { header: 'Evening.Qty', key: 'eQty', width: 18 },
        { header: 'Evening.Amt', key: 'eAmt', width: 18 },
        { header: 'Total Ltr', key: 'tLtr', width: 12 },
        { header: 'Total Rs', key: 'tRs', width: 15 },
      ];
      worksheet.columns = colHeaders.map(c => ({ key: c.key, width: c.width }));

      const headerRow = worksheet.getRow(3);
      colHeaders.forEach((h, i) => {
        headerRow.getCell(i + 1).value = h.header;
      });
      headerRow.eachCell(c => {
        c.font = { bold: true, color: { argb: 'FFFFFF' } };
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2E75B6' } };
        c.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      // Data Rows
      entries.forEach(e => {
        worksheet.addRow({
          date: e.date.toISOString().split('T')[0],
          slNo: e.vendor.slNo,
          name: e.vendor.name,
          type: e.vendor.milkType || 'N/A',
          mQty: e.morning.qty,
          mAmt: e.morning.amount,
          eQty: e.evening.qty,
          eAmt: e.evening.amount,
          tLtr: e.dayTotalMilk,
          tRs: e.dayTotalAmount,
        }).alignment = { horizontal: 'center' };
      });

      // Grand Total Row
      const gTotal = worksheet.addRow([
        'GRAND TOTAL',
        '',
        '',
        '',
        totals.mQty,
        totals.mAmt,
        totals.eQty,
        totals.eAmt,
        totals.tMilk,
        totals.tAmt,
      ]);
      gTotal.font = { bold: true };
      worksheet.mergeCells(`A${gTotal.number}:D${gTotal.number}`);

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}.xlsx"`);
      await workbook.xlsx.write(res);
      return;
    } else if (format === 'pdf') {
      const doc = new PDFDocument({ margin: 30, size: 'A4' });
      res.setHeader('Content-Type', 'application/pdf');
      res.attachment(`${fileName}.pdf`);
      doc.pipe(res);

      // --- Header Section ---
      doc
        .fillColor('#E74C3C')
        .fontSize(22)
        .text('KISHAN MILK COLLECTION CENTER', { align: 'center', b: true });
      doc
        .fillColor('#2C3E50')
        .fontSize(10)
        .text('Village: Arniya, Dist: Vaishali (Bihar)', { align: 'center' });
      doc
        .fontSize(12)
        .moveDown(0.5)
        .text(`Monthly Statement - ${month}/${year}`, { align: 'center', underline: true });
      doc.moveDown(1);

      // Farmer Info
      doc
        .fontSize(11)
        .fillColor('black')
        .text(`Farmer Name: ${user ? user.name : 'ALL FARMERS'}`, { continued: true })
        .text(` | SL No: ${user ? user.slNo : 'N/A'}`, { align: 'left' });

      doc.moveDown(0.5);
      doc.path('M 30 135 L 565 135').lineWidth(1).stroke(); // Stylish Divider Line
      doc.moveDown(1);

      const table = {
        headers: [
          'Date',
          'SL',
          'Name',
          'Morning Qty',
          'Morning Amt',
          'Evening Qty',
          'Evening Amt',
          'Day Total Milk',
          'Total Amount',
        ],
        rows: entries.map(e => [
          e.date.toISOString().split('T')[0],
          e.vendor.slNo,
          e.vendor.name,
          e.morning.qty,
          e.morning.amount,
          e.evening.qty,
          e.evening.amount,
          e.dayTotalMilk,
          e.dayTotalAmount,
        ]),
      };

      await doc.table(table, {
        prepareHeader: () => doc.font('Helvetica-Bold').fontSize(9).fillColor('#2980B9'),
        prepareRow: (row, i) => doc.font('Helvetica').fontSize(8).fillColor('#333333'),
      });
      // --- Footer Section ---
      doc.moveDown(2);
      doc.fontSize(10).fillColor('black').text('________________________', { align: 'right' });
      doc.text('Manager Signature', { align: 'right' });
      doc.text(`Generated on: ${new Date().toLocaleString()}`, { align: 'left' });
      doc.end();
    } else {
      throw new ApiError(400, 'Invalid format: Supported formats are excel, and pdf');
    }
  } catch (error) {
    throw new ApiError(500, error.message || 'Error occurred while exporting milk entries');
  }
});

export { addMilkEntry, updateMilkEntry, getMilkEntries, getMilkEntriesBySlNo, exportMilkEntries };
