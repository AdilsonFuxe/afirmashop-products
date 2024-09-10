import ProductModel from '../models/product-model.js';

export const createProductRepository = async ({name, categoryId, price}) => {
  const product = new ProductModel({name, categoryId, price});
  await product.save();
  return product;
};

export const loadProductsRepository = async () => {
  return await ProductModel.find();
};
