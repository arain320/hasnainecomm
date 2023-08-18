const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  const cookies = req.headers.cookie;
  const token = cookies.split("=")[1];
  if (!token) {
    res.status(404).json({ message: "no token found" });
  }
  jwt.verify(String(token), process.env.JWT_SECRET, (err, user) => {
    if (err) {
      res.status(404).json({ message: "invalid token found" });
      console.log(err);
    }
    next();
  });
};

module.exports = protect;
