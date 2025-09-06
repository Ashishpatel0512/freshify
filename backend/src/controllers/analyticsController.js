import Order from '../models/Order.js';

export const ordersByStatus = async (req, res) => {
  try {
    const agg = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Default map banate hai
    const statusMap = { Pending: 0, Processing: 0, Delivered: 0 };

    // Aggregate result se map fill karte hai
    agg.forEach(item => {
      if (statusMap.hasOwnProperty(item._id)) {
        statusMap[item._id] = item.count;
      }
    });

    res.status(200).json(statusMap);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
