const prisma = require("../config/prisma");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { phonenumber, password } = req.body;
    console.log(req.body)

    if (!phonenumber || !password) {
      return res.status(400).json({ message: `Can't Access.` });
    }
    const checkUser = await prisma.staff.findFirst({
      where: {
        phonenumber: phonenumber,
      },
    });
    if (!checkUser) {
      return res
        .status(404)
        .json({ message: `There's no User with this Phonenumber.` });
    } else if (checkUser.aviable !== true) {
      return res.status(400).json({ message: `This User is not Aviable.` });
    } else if (checkUser.password !== password) {
      return res.status(400).json({ message: `The Password is not correct.` });
    }
    const payload = {
      id: checkUser.id,
      firstname: checkUser.firstname,
      lastname: checkUser.lastname,
      phonenumber: checkUser.phonenumber,
      role: checkUser.role,
      image: checkUser.image,
    };

    jwt.sign(payload, process.env.SECRET, { expiresIn: "1d" }, (err, token) => {
      if (err) {
        return res.status(500).json({ message: `Token error` });
      }
      res.send({ payload, token });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

exports.createStaff = async (req, res) => {
  try {
    const { firstname, lastname, phonenumber, birdDate } = req.body;
    if (!firstname || !lastname || !phonenumber || !birdDate) {
      return res.status(404).json({ message: `Can't create with emty value.` });
    }

    const checkPhone = await prisma.staff.findMany({
      where: {
        phonenumber: phonenumber,
      },
    });

    console.log(checkPhone);

    if (checkPhone.length > 0) {
      return res
        .status(402)
        .json({ message: "This phonenumber already used." });
    }
    const createStaff = await prisma.staff.create({
      data: {
        firstname: firstname,
        lastname: lastname,
        phonenumber: phonenumber,
        birdDate: new Date(birdDate),
      },
    });
    res.send(createStaff);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error` });
  }
};

exports.currentUser = async (req, res) => {
  try {
    const user = await prisma.staff.findFirst({
      where: {
        phonenumber: req.user.phonenumber,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        role: true,
      },
    });
    res.json({ user });
  } catch (err) {
    return res.status(500).json({ message: `server error` });
  }
};
