import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';

interface IOrder {
  payment: 'card' | 'online';
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

const createOrder = async (
  req: Request<Record<string, string>, unknown, IOrder>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { items, total } = req.body;

    const normalizedIds = items.map((id) => id.toLowerCase());
    const uniqueIds = [...new Set(normalizedIds)];

    const products = await Product.find({
      _id: { $in: uniqueIds },
    });

    if (products.length !== uniqueIds.length) {
      throw new BadRequestError(
        'Один или несколько товаров не найдены',
      );
    }

    const unavailableProduct = products.find(
      (product) => product.price === null,
    );

    if (unavailableProduct) {
      throw new BadRequestError(
        `Товар «${unavailableProduct.title}» не продаётся`,
      );
    }

    const prices = new Map(
      products.map((product) => [
        product._id.toString(),
        product.price,
      ]),
    );

    const calculatedTotal = normalizedIds.reduce(
      (sum, id) => sum + (prices.get(id) ?? 0),
      0,
    );

    if (calculatedTotal !== total) {
      throw new BadRequestError(
        'Сумма заказа не совпадает со стоимостью товаров',
      );
    }

    res.json({
      id: randomUUID(),
      total: calculatedTotal,
    });
  } catch (error) {
    next(error);
  }
};

export default createOrder;
