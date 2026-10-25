import { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';

import HttpError from '../errors/http-error';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import InternalServerError from '../errors/internal-server-error';

const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req,
  res,
  next,
): void => {
  if (res.headersSent) {
    next(error);
    return;
  }

  let handledError: HttpError;

  if (error instanceof HttpError) {
    handledError = error;
  } else if (
    error instanceof mongoose.Error.ValidationError
    || error instanceof mongoose.Error.CastError
  ) {
    handledError = new BadRequestError(
      'Ошибка валидации данных при создании товара',
    );
  } else if (
    error instanceof mongoose.mongo.MongoServerError
    && error.code === 11000
  ) {
    handledError = new ConflictError();
  } else if (
    error instanceof SyntaxError
    && 'status' in error
    && error.status === 400
  ) {
    handledError = new BadRequestError(
      'Некорректный JSON в теле запроса',
    );
  } else {
    handledError = new InternalServerError();
  }

  const message = handledError.statusCode === 500
    ? 'Внутренняя ошибка сервера'
    : handledError.message;

  res.status(handledError.statusCode).json({ message });
};

export default errorHandler;
