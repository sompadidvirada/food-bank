const prisma = require("../config/prisma");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.SECREY_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SECREY_AWS_SECRET_ACCESS_KEY,
  },
});

exports.login = async (req, res) => {
  try {
    const { phonenumber, password } = req.body;
    if (!phonenumber) {
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
    } else if (checkUser.password === null) {
      return res.status(200).json({ message: `insert new password` });
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
    const {
      firstName,
      lastName,
      phonenumber,
      birthDate,
      imageStaff,
      contentType,
    } = req.body;

    if (!firstName || !lastName || !phonenumber || !birthDate) {
      return res
        .status(400)
        .json({ message: `Can't create with empty value.` });
    }

    // Use uploaded image filename or fallback to 'default.png'

    const checkPhone = await prisma.staff.findMany({
      where: {
        phonenumber: phonenumber,
      },
    });

    if (checkPhone.length > 0) {
      return res
        .status(400)
        .json({ message: "This phonenumber already used." });
    }

    let imageUploadUrl = null;

    if (imageStaff) {
      const command = new PutObjectCommand({
        Bucket: process.env.SECREY_AWS_BUCKET_STAFF,
        Key: imageStaff,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      });

      imageUploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

      if (!imageUploadUrl) {
        return res.status(500).json({ message: `Something went wrong.` });
      }
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

    res.json({ createStaff, imageUploadUrl });
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
    } else if (userToDelete.image !== null) {
      try {
        const params = {
          Bucket: process.env.SECREY_AWS_BUCKET_STAFF,
          Key: userToDelete.image,
        };

        const command = new DeleteObjectCommand(params);
        await s3.send(command);

        console.log("Deleted old image:", exitingUser.image);
      } catch (err) {
        console.error("Error deleting old image:", err.message);
      }
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
exports.createNewPassword = async (req, res) => {
  try {
    const { phonenumber, password } = req.body;

    if (!phonenumber || !password) {
      return res.status(404).json({ message: `Emty value.` });
    }

    await prisma.staff.update({
      where: {
        phonenumber: phonenumber,
      },
      data: {
        password: password,
      },
    });
    res.status(200).json({ message: `Create new password success!` });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error` });
  }
};
