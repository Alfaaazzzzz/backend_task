//verifying token * Decode the token
const jwt = require("jsonwebtoken");

let authenticate = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send("Un Authorized Access - No Header");
  }
  let token = req.headers.authorization.split(" ")[1];
  if (token === null) {
    return res.status(401).send("Un Authorized Access - Null");
  }

  let payload = jwt.verify(token, process.env.S_KEY);
  console.log("authenticate File .....", payload.user);
  if (!payload) {
    return res.status(401).send("Un Authorized Access");
  }
  req.user = payload.user;
  next();
};

module.exports = authenticate;

