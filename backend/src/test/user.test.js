const server = require('../../server.js');
const sa = require('supertest');
const loki = require('lokijs');
const uuid = require('uuid');
const lolex = require('lolex');

let userApi, db, theServer ;
let request, clock, emailMock ;

afterEach(() => {
  theServer.close();
  clock.uninstall();
  jest.resetModules();
});

beforeEach(() => {
  const mock = jest.fn(() => true);
  jest.mock('../services/email_service', () => {return {sendEmail: mock}});
  emailMock = mock;
  const lokidb = new loki(`${uuid.v4()}.json`);
  const users = lokidb.addCollection('users');
  db = { users: () => users };
  const saveXHR = window.XMLHttpRequest;
  window.XMLHttpRequest = undefined;
  theServer = server(db);
  request = sa(theServer);
  window.XMLHttpRequest = saveXHR;
  clock = lolex.install();
});

test('A new user should earn 50 points', async() => {
  const phone = 2010000001;
  const user = {
    firstName: 'al',
    lastName: 'betty',
    email: 'thatsnotright@gmail.com'
  };
  let response = await request.get(`/api/user/${phone}`).expect(404);

  response = await request.post(`/api/user/${phone}`)
      .send(user).expect(200);
  expect(response.body.phoneNumber).toEqual(phone);
  expect(response.body.points).toEqual(50);
  expect(response.body.checkins).toEqual(1);
  expect(emailMock.mock.calls.length).toEqual(1);
});


test('An existing should earn 20 points, but not if they checked in in the past 5 minutes', async() => {
  const phone = 2010000002;
  const user = {
    firstName: 'al',
    lastName: 'betty',
    email: 'thatsnotright@gmail.com'
  };
  let response = await request.get(`/api/user/${phone}`).expect(404);

  response = await request.post(`/api/user/${phone}`)
      .send(user).expect(200);

  expect(response.body.phoneNumber).toEqual(phone);
  expect(response.body.points).toEqual(50);
  expect(response.body.checkins).toEqual(1);

  response = await request.get(`/api/user/${phone}`).expect(200);

  expect(response.body.points).toEqual(50);
  expect(response.body.checkins).toEqual(1);

  let now = new Date().getTime();
  now += 5 * 60 * 1000 + 1; // 5 minutes 1 millisecond
  now = new Date(now)

  clock.setSystemTime(now);

  response = await request.get(`/api/user/${phone}`).expect(200);
  expect(response.body.points).toEqual(70);
  expect(response.body.checkins).toEqual(2);
  expect(emailMock.mock.calls.length).toEqual(2);
});

test('Requires certain fields', async() => {
  const phone = 2010000002;
  const user = {
    firstName: '',
    lastName: 'betty',
    email: 'thatsnotright@gmail.com'
  };
  await request.post(`/api/user/${phone}`)
    .send(user).expect(400);
  await request.post(`/api/user/${phone}`)
    .send({lastName: ''}).expect(400);
  await request.post(`/api/user/${phone}`)
    .send({email: 'a@'}).expect(400);
});
