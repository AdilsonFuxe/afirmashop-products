import {Router} from 'express';
import {
  createProductRepository, loadProductsRepository
} from './db/mongoose/repositories/products-repositories.js';
import kafka from './kafka.js';
import {loadCategoryByIdRepository} from "./db/mongoose/repositories/categories-repositories.js";

const router = Router();

router.post('/products', async (req, res) => {
  const {name, price, categoryId} = req.body;

  const category = await loadCategoryByIdRepository(categoryId);

  if (!category) {
    return res.status(400).json({error: "Category not found"});
  }

  const result = await createProductRepository({
    name, price, categoryId
  });
  const producer = kafka.producer();
  await producer.connect();
  await producer.send({
    topic: 'afirma-events',
    messages: [
      {key: `create-product:${result._id}`, value: JSON.stringify(result)},
    ],
  });

  await producer.disconnect();
  return res.status(201).json(result);
});

router.get('/products', async (req, res) => {
  const products = await loadProductsRepository();
  return res.status(200).json(products);
});

export default router;
