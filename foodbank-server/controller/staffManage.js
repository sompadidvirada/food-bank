const prisma = require("../config/prisma");
const jwt = require("jsonwebtoken");
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

exports.getStaffInfos = async (req, res) => {
  try {
    const getStaffInfo = await prisma.staff.findMany({
      select: {
        id: true,
        firstname: true,
        lastname: true,
        phonenumber: true,
        role: true,
        birdDate: true,
        aviable: true,
        branch: true,
        image: true,
      },
    });
    res.send(getStaffInfo);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error` });
  }
};

exports.updateBranchStaff = async (req, res) => {
  try {
    const { id } = req.params; // staff ID
    const { branchId } = req.body;

    if (!id || !branchId) {
      return res
        .status(400)
        .json({ message: `Can't update branch with empty value.` });
    }

    // Update the staff's branch
    const updatedStaff = await prisma.staff.update({
      where: {
        id: Number(id),
      },
      data: {
        branchId: Number(branchId),
      },
      include: {
        branch: true, // optional: include updated branch info
      },
    });

    return res
      .status(200)
      .json({ message: "Branch updated successfully.", staff: updatedStaff });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: `Server error.` });
  }
};

exports.updateStatusStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log(status);

    if (!id || typeof status !== "boolean") {
      return res.status(400).json({ message: `Invalid or missing status.` });
    }

    const updateStt = await prisma.staff.update({
      where: {
        id: Number(id),
      },
      data: {
        aviable: Boolean(status),
      },
    });
    res.send(updateStt);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error` });
  }
};

exports.updateRoleStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!id || !role) {
      return res
        .status(400)
        .json({ message: `Can't update role with emty value.` });
    }

    const respone = await prisma.staff.update({
      where: {
        id: Number(id),
      },
      data: {
        role: role,
      },
    });
    res.send(respone);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

exports.updateMainStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstname,
      lastname,
      phonenumber,
      password,
      imageName,
      contentType,
    } = req.body;

    if (!id || !firstname || !lastname || !phonenumber) {
      return res.status(400).json({ message: `Invalid input data.` });
    }

    const exitingUser = await prisma.staff.findUnique({
      where: { id: Number(id) },
    });

    if (!exitingUser) {
      return res.status(404).json({ message: `Staff not found.` });
    }

    const phoneCheck = await prisma.staff.findFirst({
      where: {
        phonenumber: phonenumber,
        id: { not: Number(id) },
      },
      include: {
        branch: true,
      },
    });

    if (phoneCheck) {
      return res
        .status(400)
        .json({ message: `Other User Already Use This Phone number.` });
    }

    const updateData = { firstname, lastname };
    if (password || password !== "") {
      updateData.password = password;
    }
    if (exitingUser.phonenumber !== phonenumber) {
      updateData.phonenumber = phonenumber;
    }

    let imageUploadUrl = null;

    if (imageName) {
      if (exitingUser.image) {
        try {
          const params = {
            Bucket: process.env.SECREY_AWS_BUCKET_STAFF,
            Key: exitingUser.image,
          };

          const command = new DeleteObjectCommand(params);
          await s3.send(command);

          console.log("Deleted old image:", exitingUser.image);
        } catch (err) {
          console.error("Error deleting old image:", err.message);
        }
      }

      const command = new PutObjectCommand({
        Bucket: process.env.SECREY_AWS_BUCKET_STAFF,
        Key: imageName,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      });

      imageUploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

      if (!imageUploadUrl) {
        return res.status(500).json({ message: `Something went wrong.` });
      }

      updateData.image = imageName;
    }

    const updatedStaff = await prisma.staff.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        branch: true,
      },
    });

    const payload = {
      id: updatedStaff.id,
      firstname: updatedStaff.firstname,
      lastname: updatedStaff.lastname,
      phonenumber: updatedStaff.phonenumber,
      role: updatedStaff.role,
      status: updatedStaff.aviable,
      image: updatedStaff.image,
      userBranch: updatedStaff.branchId ?? null,
      branchName: updatedStaff.branch?.branchname ?? null, // safe access
    };

    jwt.sign(
      payload,
      process.env.SECRET,
      { expiresIn: "20h" },
      (err, token) => {
        if (err) {
          return res.status(500).json({ message: "Token error." });
        }

        res.send({
          payload,
          token,
          imageUploadUrl, // <- signed URL for frontend to PUT image
        });
      }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: `Server error.` });
  }
};

exports.clearPasswordStaff = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: `Emty value` });
    }
    const checkStaff = await prisma.staff.findFirst({
      where: {
        id: Number(id),
      },
    });
    if (!checkStaff) {
      return res.status(400).json({ message: `Something went wrong.` });
    }

    await prisma.staff.update({
      where: {
        id: Number(id),
      },
      data: {
        password: null,
      },
    });
    res.status(200).json({ message: `ລ້າງລະຫັດຜ່ານລຳເລັດ.` });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error` });
  }
};
