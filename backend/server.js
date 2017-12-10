const Koa = require('koa2');
const Body = require('koa-body');
const Session = require("koa-session2");
const log = require('./src/log');
const {ui, validate, router} = require('swagger2-koa');
const swagger = require('swagger2');

function server(db) {
  const usersDb = db.users();

  const app = new Koa();

  app.use(async(ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
  });

  app.use(async(ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}`);
  });

  app.use(Session({
    key: "SUPERSESSIONIFIC",
    //  secure: true,
    httpOnly: true,
    overwrite: true,
  //  signed: true
  }));

  app.use(require('./src/errors').handler);

  const swagDoc = require('path').resolve(__dirname, 'swagger.yml');
  const document = swagger.loadDocumentSync(swagDoc);

  if (!swagger.validateDocument(document)) {
    throw Error(`./swagger.yml does not conform to the Swagger 2.0 schema`);
  }

  app.use(Body());
  app.use(validate(document));
  app.use(ui(document, "/swagger"));

  require('./src/routes/users.js')(app, db.users(), log);

  return app.listen(8080);
}

module.exports = server;
