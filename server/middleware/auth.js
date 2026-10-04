const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

function getUserIdFromReq(req) {
  return new Promise((resolve, reject) => {
    const { token } = req.cookies;
    if (!token) return reject('Not logged in');
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) return reject(err);
      resolve(userData.id);
    });
  });
}

module.exports = { getUserIdFromReq };
