const Router = require('koa-router');
const curry = require('curry');

const { createUser, checkin } = require('../services/user_service');
const { notFound, badRequest, validationFailed } = require('../errors');

const router = new Router({
  prefix: "/api/user"
});

const validatePhone = (phone) => {
  if (phone > 9999999999 || phone < 2010000000) {
    console.log(phone);
    throw badRequest;
  }
}

const validate = (body) => {
  if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(body.email))
    throw validationFailed('email is not in the correct form');
  if (body.firstName.trim().length === 0)
    throw validationFailed('firstName is required to be non-empty')
  if (body.lastName.trim().length === 0)
    throw validationFailed('lastName is required to be non-empty')
}

const create = async(db, log, ctx, next) => {
  validatePhone(ctx.params.phoneNumber);
  validate(ctx.request.body);
  const phone = parseInt(ctx.params.phoneNumber);
  ctx.body = await createUser(db, phone, ctx.request.body);
}

const get = async(db, log, ctx, next) => {
  validatePhone(ctx.params.phoneNumber);
  const phone = parseInt(ctx.params.phoneNumber);
  const user = await checkin(db, phone);
  ctx.body = user;
}

module.exports = (app, db, log) => {
  router.get('/:phoneNumber', curry.to(4, get)(db, log));
  router.post('/:phoneNumber', curry.to(4, create)(db, log));
  const routes = router.routes();
  app.use(routes)
};
