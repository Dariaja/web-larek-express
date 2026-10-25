import HttpError from './http-error';

class ConflictError extends HttpError {
  constructor(message = 'Товар с таким названием уже существует') {
    super(409, message);
  }
}

export default ConflictError;
