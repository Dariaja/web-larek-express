import HttpError from './http-error';

class InternalServerError extends HttpError {
  constructor(message = 'Внутренняя ошибка сервера') {
    super(500, message);
  }
}

export default InternalServerError;
