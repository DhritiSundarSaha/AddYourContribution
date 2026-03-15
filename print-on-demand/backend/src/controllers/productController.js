import { Product } from '../models/Product.js';

export async function listProducts(req, res) {
  const { category, designCategory, type } = req.query;
  const query = {
    ...(category ? { category } : {}),
    ...(designCategory ? { designCategory } : {}),
    ...(type ? { type } : {})
  };
  const products = await Product.find(query).sort({ createdAt: -1 });
  res.json(products);
}

export async function createProduct(req, res) {
  const product = await Product.create(req.body);
  res.status(201).json(product);
}
