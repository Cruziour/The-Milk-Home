import { MilkEntry } from '../models/milk_entry.model.js';
import { User } from '../models/user.model.js';
import { Payment } from '../models/payment.model.js';
import { asyncHandler, ApiError, ApiResponse } from '../utils/index.js';
import PDFDocument from 'pdfkit-table';

const addPayment = asyncHandler(async (req, res) => {
  const { slNo, amount, remark, month, year, paymentDate } = req.body;

  if (!slNo || !amount || !month || !year) {
    throw new ApiError(400, 'All fields are required');
  }

  const user = await User.findOne({ slNo });
  if (!user) throw new ApiError(404, 'Vendor not found');

  const count = await Payment.countDocuments();
  const voucherId = `PAY-${year}${month}-${1000 + count}`;

  const payment = await Payment.create({
    vendor: user._id,
    slNo,
    amount,
    remark: remark || 'Cash Payment',
    month: parseInt(month),
    year: parseInt(year),
    voucherId,
    paymentDate: paymentDate || new Date(), // User ki selected date use hogi
  });

  return res.status(201).json(new ApiResponse(201, payment, 'Payment voucher created'));
});

const getVendorLedger = asyncHandler(async (req, res) => {
  const { slNo, month, year } = req.query;

  if (!slNo || !month || !year) throw new ApiError(400, 'slNo, month and year are required');

  const user = await User.findOne({ slNo });
  if (!user) throw new ApiError(404, 'Vendor not found');

  const m = parseInt(month);
  const y = parseInt(year);
  const startDate = new Date(y, m - 1, 1);
  const endDate = new Date(y, m, 1);

  // 1. Opening Balance (Previous months sum)
  const milkBefore = await MilkEntry.aggregate([
    { $match: { vendor: user._id, date: { $lt: startDate } } },
    { $group: { _id: null, total: { $sum: '$dayTotalAmount' } } },
  ]);

  const payBefore = await Payment.aggregate([
    { $match: { vendor: user._id, paymentDate: { $lt: startDate } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  const openingBalance = (milkBefore[0]?.total || 0) - (payBefore[0]?.total || 0);

  // 2. Current Month Entries
  const currentMilk = await MilkEntry.find({
    vendor: user._id,
    date: { $gte: startDate, $lt: endDate },
  }).sort({ date: 1 });

  const currentPayments = await Payment.find({
    vendor: user._id,
    paymentDate: { $gte: startDate, $lt: endDate },
  }).sort({ paymentDate: 1 });

  // 3. Mapping for Frontend Table
  const vouchers = [
    ...currentMilk.map(item => ({
      id: `MILK-${item._id.toString().slice(-4)}`,
      date: item.date.toISOString().split('T')[0],
      title: 'Milk Collection',
      dr: 0,
      cr: item.dayTotalAmount || 0,
      type: 'CREDIT',
    })),
    ...currentPayments.map(item => ({
      id: item.voucherId,
      date: item.paymentDate.toISOString().split('T')[0],
      title: item.remark,
      dr: item.amount,
      cr: 0,
      type: 'DEBIT',
    })),
  ].sort((a, b) => new Date(a.date) - new Date(b.date));

  const totalCredit = currentMilk.reduce((acc, curr) => acc + (curr.dayTotalAmount || 0), 0);
  const totalDebit = currentPayments.reduce((acc, curr) => acc + curr.amount, 0);
  const netPayable = openingBalance + totalCredit - totalDebit;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: { name: user.name, slNo: user.slNo, phone: user.phone },
        summary: {
          openingBalance: parseFloat(openingBalance.toFixed(2)),
          totalCredit: parseFloat(totalCredit.toFixed(2)),
          totalDebit: parseFloat(totalDebit.toFixed(2)),
          netPayable: parseFloat(netPayable.toFixed(2)),
        },
        vouchers,
        isSettled: netPayable === 0,
      },
      'Ledger retrieved'
    )
  );
});

const downloadVendorLedger = asyncHandler(async (req, res) => {
  const { slNo, month, year } = req.query;

  if (!slNo || !month || !year) throw new ApiError(400, 'Parameters required');

  const user = await User.findOne({ slNo });
  if (!user) throw new ApiError(404, 'Vendor not found');

  const m = parseInt(month);
  const y = parseInt(year);
  const startDate = new Date(y, m - 1, 1);
  const endDate = new Date(y, m, 1);

  // Logic to fetch data (Same as getVendorLedger)
  const milkBefore = await MilkEntry.aggregate([
    { $match: { vendor: user._id, date: { $lt: startDate } } },
    { $group: { _id: null, total: { $sum: '$dayTotalAmount' } } },
  ]);
  const payBefore = await Payment.aggregate([
    { $match: { vendor: user._id, paymentDate: { $lt: startDate } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  const openingBalance = (milkBefore[0]?.total || 0) - (payBefore[0]?.total || 0);

  const currentMilk = await MilkEntry.find({
    vendor: user._id,
    date: { $gte: startDate, $lt: endDate },
  });
  const currentPayments = await Payment.find({
    vendor: user._id,
    paymentDate: { $gte: startDate, $lt: endDate },
  });

  const vouchers = [
    ...currentMilk.map(i => ({
      date: i.date.toISOString().split('T')[0],
      title: 'Milk Collection',
      dr: 0,
      cr: i.dayTotalAmount,
    })),
    ...currentPayments.map(i => ({
      date: i.paymentDate.toISOString().split('T')[0],
      title: i.remark,
      dr: i.amount,
      cr: 0,
    })),
  ].sort((a, b) => new Date(a.date) - new Date(b.date));

  // PDF Generation
  const doc = new PDFDocument({ margin: 50 });
  const filename = `Ledger_${slNo}_${month}_${year}.pdf`;

  res.setHeader('Content-disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-type', 'application/pdf');

  doc.pipe(res);

  // Header
  doc.fontSize(20).text('KISHAN MILK COLLECTION CENTER', { align: 'center' }).moveDown(0.5);
  doc.fontSize(12).text('Vendor Statement of Account', { align: 'center' }).moveDown(1);

  doc.fontSize(10).text(`Vendor: ${user.name} (${user.slNo})`);
  doc.fontSize(10).text(`Phone:${user.phone}`);
  doc.fontSize(10).text(`Address: ${user.address}`);
  doc.text(`Period: ${month}/${year}`);
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`).moveDown(1);

  // Table Header
  const tableTop = 200;
  doc.font('Helvetica-Bold');
  doc.text('Date', 50, tableTop);
  doc.text('Particulars', 150, tableTop);
  doc.text('Debit (Dr)', 350, tableTop, { width: 90, align: 'right' });
  doc.text('Credit (Cr)', 450, tableTop, { width: 90, align: 'right' });

  doc
    .moveTo(50, tableTop + 15)
    .lineTo(550, tableTop + 15)
    .stroke();

  // Opening Balance Row
  let yPos = tableTop + 25;
  doc.font('Helvetica');
  doc.text(startDate.toISOString().split('T')[0], 50, yPos);
  doc.text('Opening Balance B/F', 150, yPos);
  doc.text(openingBalance.toFixed(2), 450, yPos, { width: 90, align: 'right' });

  // Transaction Rows
  vouchers.forEach(v => {
    yPos += 20;
    doc.text(v.date, 50, yPos);
    doc.text(v.title, 150, yPos);
    if (v.dr > 0) doc.text(v.dr.toFixed(2), 350, yPos, { width: 90, align: 'right' });
    if (v.cr > 0) doc.text(v.cr.toFixed(2), 450, yPos, { width: 90, align: 'right' });

    if (yPos > 700) {
      doc.addPage();
      yPos = 50;
    }
  });

  // Summary Footer
  yPos += 30;
  doc.moveTo(50, yPos).lineTo(550, yPos).stroke();
  yPos += 10;
  const netPayable =
    openingBalance +
    currentMilk.reduce((s, c) => s + c.dayTotalAmount, 0) -
    currentPayments.reduce((s, p) => s + p.amount, 0);

  doc.font('Helvetica-Bold');
  doc.text('Net Closing Balance:', 150, yPos);
  doc.fontSize(14).text(`Rs. ${netPayable.toFixed(2)}`, 400, yPos, { width: 140, align: 'right' });

  doc.end();
});

export { getVendorLedger, addPayment, downloadVendorLedger };
