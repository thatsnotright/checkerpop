
const server = require('./server');

const db = require('./src/db')(() => {
  const koaApp = server(db);
})
