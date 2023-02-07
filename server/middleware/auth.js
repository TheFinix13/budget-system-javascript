const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");

// const fs = require("fs");
// const admin = require("firebase-admin");

// const credentials = JSON.parse(
//   fs.readFileSync("./credentials.json", "utf8")
// )

// admin.initializeApp({
//   credential: admin.credential.cert(credentials),
// });


function auth(req, res, next) {
  try {
    const token = req.headers.authorization;
    //check for token
    if (!token) {
      res.json({ status: false, msg: "No token, authorization denied" });
    } else {
      //verify token
      const decoded = jwt.verify(token, process.env.jwtSecret);
      //add user from payload
      req.user = decoded;
      next();
    }
  } catch (e) {
    res.json({ status: false, msg: "token is not valid" });
  }
}
module.exports = { auth };
