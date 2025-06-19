const prisma = require("../config/prisma");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    res.send(`Helllo`);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

exports.createStaff = async (req, res) => {
  try {
    const { firstname, lastname, phonenumber, birdDate } = req.body;
    if (!firstname || !lastname || !phonenumber || !birdDate) {
        return res.status(404).json({message: `Can't create with emty value.`})
    }

    const createStaff = await prisma.staff.create({
        data:{
            firstname: firstname,
            lastname: lastname,
            phonenumber: phonenumber,
            birdDate: new Date(birdDate)
        }
    })
    res.send(createStaff)
} catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error` });
  }
};
