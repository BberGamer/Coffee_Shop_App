const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

const getAdminStats = async (req, res, next) => {
  try {
    const [totalProducts, totalOrders, totalCustomers, deliveredOrders, recentOrders] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Order.find({ status: 'delivered' }),
      Order.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    res.json({
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue,
      recentOrders
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats
};
