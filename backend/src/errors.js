const notFound = new Error('Not found');
const badRequest = new Error('Bad Request');

class ValidationError extends Error {
  constructor(msg = '', ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }

    this.message = msg;
  }
}

const validationFailed = (msg) => new ValidationError('Validation error', msg);

async function errorMiddleware(ctx, next) {
  try {
    await next();
  } catch (err) {
    switch(err) {
      case notFound:
        ctx.throw(404, 'Unfounded');
      case badRequest:
        ctx.throw(400, 'Bad request');
    }
    if (err.message) {
      ctx.throw(400, err.message);
    }
  }
}

module.exports = {
  notFound,
  badRequest,
  validationFailed,
  handler: errorMiddleware
}
