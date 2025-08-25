const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

exports.authCheck = async (req, res, next) => {
  try {
    const headerToken = req.headers.authorization;
    if (!headerToken) {
      return res.status(401).json({ meesage: `No Token Authorization.` });
    }

    const token = headerToken.split(" ")[1];
    const decode = jwt.verify(token, process.env.SECRET);

    req.user = decode;

    const user = await prisma.staff.findFirst({
      where: {
        phonenumber: req.user.phonenumber,
      },
    });

    if (!user.aviable) {
      return res.status(400).json({ message: `This account can't access` });
    }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired." });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token." });
    }
    console.log(err);
    return res.status(500).json({ message: "Server error." });
  }
};

exports.adminCheck = async (req, res, next) => {
  try {
    const { phonenumber } = req.user;
    if (!phonenumber || phonenumber === "") {
      return res.status(400).json({ message });
    }

    const checkAdmin = await prisma.staff.findFirst({
      where: {
        phonenumber: phonenumber,
      },
    });

    if (!checkAdmin || checkAdmin.role !== "admin") {
      return res.status(400).json({ message: `This user can't access.` });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};
