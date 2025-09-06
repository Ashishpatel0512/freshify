import fs from 'fs';
import PDFDocument from 'pdfkit';
import Order from '../models/Order.js';
import path from 'path';

export const generateInvoice = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email hotelName');
  if (!order) return res.status(404).json({ message: 'Order not found' });

  const doc = new PDFDocument({ margin: 50 });
  const fileName = `invoice-${order._id}.pdf`;
  const filePath = path.join(process.cwd(), 'uploads', fileName);

  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc.fontSize(20).text('Veg Store - Invoice', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Order ID: ${order._id}`);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
  doc.text(`Customer: ${order.user?.name || 'N/A'} ${order.user?.hotelName ? ' - ' + order.user.hotelName : ''}`);
  doc.moveDown();

  order.items.forEach((it) => {
    doc.text(`${it.name} — ₹${it.price} × ${it.qty} = ₹${it.price * it.qty}`);
  });

  doc.moveDown();
  doc.fontSize(14).text(`Total: ₹${order.total}`, { align: 'right' });
  doc.end();

  stream.on('finish', () => {
    res.download(filePath, fileName, (err) => {
      try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
    });
  });
};
