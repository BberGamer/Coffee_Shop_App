const Order = require('../models/Order');
const Product = require('../models/Product');
const { getSizePrice } = require('../utils/pricing');

const STOCK_DEDUCT_STATUSES = new Set(['preparing', 'delivered']);

const buildOrderQuantityMap = (items = []) =>
  items.reduce((acc, item) => {
    const productId = item.product.toString();
    acc.set(productId, (acc.get(productId) || 0) + Number(item.quantity || 0));
    return acc;
  }, new Map());

const syncOrderInventory = async (order, shouldDeduct) => {
  const quantityMap = buildOrderQuantityMap(order.items);
  const productIds = Array.from(quantityMap.keys());
  const products = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(products.map((product) => [product._id.toString(), product]));

  for (const [productId, quantity] of quantityMap.entries()) {
    const product = productMap.get(productId);

    if (!product) {
      const error = new Error('One or more ordered products no longer exist.');
      error.statusCode = 400;
      throw error;
    }

    if (shouldDeduct && product.stock < quantity) {
      const error = new Error(
        `"${product.name}" only has ${product.stock} item(s) remaining, but this order needs ${quantity}.`
      );
      error.statusCode = 400;
      throw error;
    }
  }

  for (const [productId, quantity] of quantityMap.entries()) {
    const product = productMap.get(productId);
    product.stock += shouldDeduct ? -quantity : quantity;
    await product.save();
  }
};

const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, note } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required.' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({ message: 'Shipping address is incomplete.' });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: 'Payment method is required.' });
    }

    const normalizedItems = [];
    const requestedQuantityMap = new Map();

    for (const item of items) {
      let product = null;

      if (item.product) {
        product = await Product.findById(item.product);
      }

      if (!product && item.slug) {
        product = await Product.findOne({ slug: item.slug });
      }

      if (!product) {
        return res.status(400).json({
          message: `Product "${item.name || item.slug || item.product || 'unknown'}" is invalid or not found.`
        });
      }

      if (product.status !== 'active') {
        return res.status(400).json({
          message: `Product "${product.name}" is currently unavailable.`
        });
      }

      const quantity = Number(item.quantity || 1);
      if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({
          message: `Quantity for "${product.name}" must be at least 1.`
        });
      }

      const productId = product._id.toString();
      const totalRequested = (requestedQuantityMap.get(productId) || 0) + quantity;
      requestedQuantityMap.set(productId, totalRequested);

      if (totalRequested > product.stock) {
        return res.status(400).json({
          message: `You ordered too many "${product.name}". Only ${product.stock} item(s) are currently available.`
        });
      }

      normalizedItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: getSizePrice(product.price, item.size || 'S'),
        size: item.size || 'S',
        quantity
      });
    }

    const subtotal = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal >= 25 ? 0 : 5;
    const totalAmount = subtotal + shippingFee;

    const order = await Order.create({
      user: req.user._id,
      items: normalizedItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      status: 'pending',
      inventoryAdjusted: false,
      subtotal,
      shippingFee,
      totalAmount,
      note: note || ''
    });

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      items: orders
    });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      items: orders
    });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const isOwner = req.user._id.toString() === order.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'You cannot view this order.' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'preparing', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid order status.' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const nextShouldDeduct = STOCK_DEDUCT_STATUSES.has(status);

    if (status === order.status) {
      return res.json({
        message: 'Order status updated successfully',
        order
      });
    }

    if (nextShouldDeduct && !order.inventoryAdjusted) {
      await syncOrderInventory(order, true);
      order.inventoryAdjusted = true;
    }

    if (!nextShouldDeduct && order.inventoryAdjusted) {
      await syncOrderInventory(order, false);
      order.inventoryAdjusted = false;
    }

    order.status = status;
    await order.save();

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus
};
