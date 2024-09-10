import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import kafka from './kafka.js';
import {
  createCategoryRepository,
  deleteCategoryRepository,
  updateCategoryRepository,
} from './db/mongoose/repositories/categories-repositories.js';
import routes from './routes.js';
import { addAccountRepository } from './db/mongoose/repositories/account-repository.js';

const app = express();

app.use(express.json());

app.use('/api/v1', routes);

const PORT = process.env.PORT;

const start = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const consumer = kafka.consumer({ groupId: 'products' });
  await consumer.subscribe({ topics: ['afirma-events'] });

  await consumer.run({
    eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
      const key = message.key.toString().split(':')[0];
      switch (key) {
        case 'create-category':
          const { name, _id } = JSON.parse(message.value.toString());
          createCategoryRepository({ _id, name });
          break;
        case 'delete-category':
          const { id } = JSON.parse(message.value.toString());
          deleteCategoryRepository(id);
          break;
        case 'update-category':
          const { name: categoryName, _id: categoryId } = JSON.parse(
            message.value.toString()
          );
          updateCategoryRepository(categoryId, { name: categoryName });
          break;
        case 'create-account':
          const account = JSON.parse(message.value.toString());
          account._id = account.id;
          delete account.id;
          addAccountRepository(account);
          break;
      }

      console.log({
        key: message.key.toString(),
        value: message.value.toString(),
        headers: message.headers,
      });
    },
  });

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

start();
