import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { errors } from 'celebrate';
import { PORT, DB_ADDRESS } from './config';

import Product from './models/product';
import productRouter from './routes/product';
import orderRouter from './routes/order';
import NotFoundError from './errors/not-found-error';
import errorHandler from './middlewares/error-handler';
import {
  requestLogger,
  errorLogger,
} from './middlewares/logger';

const app = express();

// Регистрируем запросы до остальных обработчиков.
app.use(requestLogger);

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (_req, res) => {
  res.json({
    message: 'Сервер Web-ларёк работает!',
  });
});

app.use('/product', productRouter);
app.use('/order', orderRouter);

// Создаём ошибку для неизвестного маршрута.
app.use((_req, _res, next) => {
  next(new NotFoundError());
});

// Сначала записываем ошибку, затем отправляем ответ клиенту.
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

const start = async (): Promise<void> => {
  await mongoose.connect(DB_ADDRESS);
  await Product.init();

  // eslint-disable-next-line no-console
  console.log('Подключение к MongoDB установлено');

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Сервер запущен: http://localhost:${PORT}`);
  });
};

start().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error('Не удалось запустить сервер:', error);
  process.exit(1);
});
