import HttpError from './http-error';

class BadRequestError extends HttpError {
  constructor(message = 'Переданы некорректные данные') {
    super(400, message);
  }
}

export default BadRequestError;
