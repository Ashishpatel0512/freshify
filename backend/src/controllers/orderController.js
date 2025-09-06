import Order from '../models/Order.js';
import Vegetable from '../models/Vegetable.js';

// export const createOrder = async (req, res) => {
//   const { items } = req.body; // [{id, qty}]
//   if (!items?.length) return res.status(400).json({ message: 'No items' });

//   // Build order items snapshot with current price
//   const dbItems = await Promise.all(items.map(async (it) => {
//     const veg = await Vegetable.findById(it.id);
//     if (!veg) throw new Error('Vegetable not found: ' + it.id);
//     return {
//       vegetable: veg._id,
//       name: veg.name,
//       price: veg.price,
//       qty: it.qty,
//     };
//   }));

//   const total = dbItems.reduce((sum, it) => sum + it.price * it.qty, 0);

//   const order = await Order.create({
//     user: req.user._id,
//     items: dbItems,
//     total,
//     paymentMethod: 'COD',
//   });

//   res.status(201).json(order);
// };
export const createOrder = async (req, res) => {
  try {
    const { items } = req.body; // [{id, qty}]
    if (!items?.length) return res.status(400).json({ message: 'No items' });

    // Build order items snapshot with current price
    const dbItems = await Promise.all(
      items.map(async (it) => {
        const veg = await Vegetable.findById(it.id);
        if (!veg) throw new Error('Vegetable not found: ' + it.id);
        return {
          vegetable: veg._id,
          name: veg.name,
          price: veg.price,
          qty: it.qty,
        };
      })
    );

    // Calculate subtotal
    const subtotal = dbItems.reduce((sum, it) => sum + it.price * it.qty, 0);

    // Apply 10% discount if subtotal >= 500
    const discount = subtotal >= 500 ? subtotal * 0.1 : 0;

    const total = subtotal - discount;

    // Create order with discounted total
    const order = await Order.create({
      user: req.user._id,
      items: dbItems,
      subtotal,
      discount,
      total,
      paymentMethod: 'COD',
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Something went wrong' });
  }
};

export const myOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

export const listOrders = async (req, res) => {
  const orders = await Order.find().populate('user', 'name email hotelName').sort({ createdAt: -1 });
  res.json(orders);
};

export const updateStatus = async (req, res) => {
  const { status } = req.body; // 'Pending' | 'Processing' | 'Delivered'
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.status = status || order.status;
  await order.save();
  res.json(order);
};
