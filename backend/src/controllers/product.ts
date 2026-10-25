import { NextFunction, Request, Response } from 'express';
import Product from '../models/product';

export const getProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const products = await Product.find({}).select('-__v');

    res.json({
      items: products,
      total: products.length,
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      title,
      image,
      category,
      description,
      price,
    } = req.body ?? {};

    const product = await Product.create({
      title,
      image,
      category,
      description,
      price,
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};
