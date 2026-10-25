import HttpError from './http-error';

class NotFoundError extends HttpError {
  constructor(message = 'Запрашиваемый ресурс не найден') {
    super(404, message);
  }
}

export default NotFoundError;
