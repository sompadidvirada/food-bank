const prisma = require("../config/prisma");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

exports.login = async (req, res) => {
  try {
    const { phonenumber, password } = req.body;
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
    const { firstName, lastName, phonenumber, birthDate } = req.body;

    if (!firstName || !lastName || !phonenumber || !birthDate) {
      return res
        .status(404)
        .json({ message: `Can't create with empty value.` });
    }

    // Use uploaded image filename or fallback to 'default.png'
    const imageStaff = req.file?.filename || "default.PNG";

    const checkPhone = await prisma.staff.findMany({
      where: {
        phonenumber: phonenumber,
      },
    });

    if (checkPhone.length > 0) {
      return res
        .status(402)
        .json({ message: "This phonenumber already used." });
    }

    const createStaff = await prisma.staff.create({
      data: {
        firstname: firstName,
        lastname: lastName,
        phonenumber: phonenumber,
        birdDate: new Date(birthDate),
        image: imageStaff,
      },
    });

    res.send(createStaff);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error` });
  }
};

exports.deleteStaff = async (req, res) => {
  try {
    const { staffId, permisionId } = req.body;

    if (!staffId || !permisionId) {
      return res.status(400).json({ message: `Emty Value.` });
    }

    const userToDelete = await prisma.staff.findFirst({
      where: {
        id: Number(staffId),
      },
    });

    if (!userToDelete || userToDelete?.id === Number(permisionId)) {
      return res.status(500).json({ message: "Something went wrong!" });
    }

    // Delete the profile image if it exists and is not a default
    const imageFile = userToDelete.image;
    const defaultImageName = "default.PNG"; // Or set this to 'default.jpg' if you have one

    if (imageFile && imageFile !== defaultImageName) {
      const filePath = path.join(
        __dirname,
        "..",
        "public",
        "staff_porfile",
        imageFile
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Deletes the file
      }
    }

    await prisma.staff.delete({
      where: {
        id: Number(staffId),
      },
    });

    res.send("Delete User Success.");
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
