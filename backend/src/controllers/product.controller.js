const Product = require('../models/Product');

const slugify = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const getProducts = async (req, res, next) => {
  try {
    const { search = '', category = '', featured = '', status = 'active' } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json({
      items: products
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      image,
      category,
      origin,
      sizes,
      featured,
      stock,
      status
    } = req.body;

    if (!name || !description || price === undefined) {
      return res.status(400).json({ message: 'Name, description and price are required.' });
    }

    const slug = slugify(name);
    const existing = await Product.findOne({ slug });
    if (existing) {
      return res.status(409).json({ message: 'A product with this name already exists.' });
    }

    const product = await Product.create({
      name,
      slug,
      description,
      price,
      image,
      category,
      origin,
      sizes: Array.isArray(sizes) && sizes.length ? sizes : ['S', 'M', 'L'],
      featured: Boolean(featured),
      stock: Number(stock || 0),
      status: status || 'active'
    });

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const {
      name,
      description,
      price,
      image,
      category,
      origin,
      sizes,
      featured,
      stock,
      status
    } = req.body;

    if (name && name !== product.name) {
      const newSlug = slugify(name);
      const existing = await Product.findOne({
        slug: newSlug,
        _id: { $ne: product._id }
      });

      if (existing) {
        return res.status(409).json({ message: 'Another product already uses this name.' });
      }

      product.name = name;
      product.slug = newSlug;
    }

    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (image !== undefined) product.image = image;
    if (category !== undefined) product.category = category;
    if (origin !== undefined) product.origin = origin;
    if (sizes !== undefined) product.sizes = sizes;
    if (featured !== undefined) product.featured = featured;
    if (stock !== undefined) product.stock = stock;
    if (status !== undefined) product.status = status;

    await product.save();

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    await product.deleteOne();

    res.json({
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
