const Product = require('../models/Product');

// @desc    Add a new product
// @route   POST /api/products/add
// @access  Private (should be protected in future)
exports.addProduct = async (req, res) => {
  try {
    const { title, description, price, category, stock } = req.body;

    // Ensure image was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const product = new Product({
      title,
      description,
      price,
      category,
      stock,
      image: req.file.filename, // multer saves file
    });

    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (err) {
    console.error('Error adding product:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all products
// @route   GET /api/products/all
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();

    const host = req.headers.host;
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const baseUrl = `${protocol}://${host}`;

    const modifiedProduct = products.map((val) => {
      return {
        ...val,
        image: `${baseUrl}/uploads/${val.image}`
      };
    });

    res.status(200).json(modifiedProduct);
  } catch (err) {
    console.error('Error fetching products:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error('Error getting product:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
