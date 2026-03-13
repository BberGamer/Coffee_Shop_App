require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const seedProducts = require('../data/seedProducts');

const slugify = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const run = async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await Product.deleteMany({});

    const admin = await User.create({
      name: 'Moon Coffee Admin',
      email: 'admin@mooncoffee.vn',
      password: '123456',
      role: 'admin',
      address: 'Hoan Kiem, Ha Noi'
    });

    await Product.insertMany(
      seedProducts.map((item) => ({
        ...item,
        slug: slugify(item.name)
      }))
    );

    console.log('Seed completed');
    console.log('Admin email:', admin.email);
    console.log('Admin password: 123456');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

run();
