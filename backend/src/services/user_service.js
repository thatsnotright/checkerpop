const { notFound, badRequest, validationFailed } = require('../errors');

const emailService = require('./email_service');

const filter = (inObj) => {
  if (!inObj)
    throw notFound;
  const {$loki, meta, ...obj} = inObj;
  return obj;
}

function getUser(db, phoneNumber) {
  return filter(db.findOne({phoneNumber}));
}

async function createUser(db, phoneNumber, user) {
  const existing = db.findOne({phoneNumber});
  if (existing)
    throw badRequest;
  const newUser = {...user,
    checkins: 1,
    points: 50,
    phoneNumber: phoneNumber,
    lastCheckin: new Date().toISOString()
  };
  try{
    await emailService.sendEmail(newUser.firstName, newUser.lastName,
      newUser.email, newUser.points);
  } catch (e) { console.log(e) }

  const a = filter(db.insert(newUser));
  return a;
}

// checkin no more often than 5 minutes
const canCheckin = (lastTime) => new Date(lastTime).getTime() < ((new Date()).getTime() - 60 * 5 * 1000);

async function checkin(db, phoneNumber) {
  const user = db.findOne({phoneNumber});
  if (!user)
    throw notFound;
  if (canCheckin(user.lastCheckin)) {
    const newUser = Object.assign({
      ...user
    }, {
      checkins: user.checkins + 1,
      points: user.points + 20,
      lastCheckin: new Date().toISOString()
    });
    const updatedUser = db.update(newUser);
    try {
      await emailService.sendEmail(updatedUser.firstName, updatedUser.lastName,
        updatedUser.email, updatedUser.points);
    } catch (e) { console.log(e) }
  }
  const a = getUser(db, phoneNumber);
  return a;
}

module.exports = {
  getUser,
  createUser,
  checkin
}
