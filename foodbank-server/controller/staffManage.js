const prisma = require("../config/prisma");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');


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
        image: true
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
    const { id } = req.params
    const { role } = req.body

    if (!id || !role) {
      return res.status(400).json({ message: `Can't update role with emty value.` })
    }

    const respone = await prisma.staff.update({
      where: {
        id: Number(id)
      }, data: {
        role: role
      }
    })
    res.send(respone)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: `server error.` })
  }
}

exports.updateMainStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, phonenumber, password } = req.body;

    if (!id || !firstname || !lastname || !phonenumber) {
      return res.status(400).json({ message: `Invalid input data.` });
    }

    const exitingUser = await prisma.staff.findUnique({
      where: { id: Number(id) }
    });

    if (!exitingUser) {
      return res.status(404).json({ message: `Staff not found.` });
    }

    const phoneCheck = await prisma.staff.findFirst({
      where: {
        phonenumber: phonenumber,
        id: { not: Number(id) },
      },
    });

    if (phoneCheck) {
      return res.status(400).json({ message: `Other User Already Use This Phone number.` });
    }


    const updateData = { firstname, lastname };
    if (password || password !== "") {
      updateData.password = password;
    }
    if (exitingUser.phonenumber !== phonenumber) {
      updateData.phonenumber = phonenumber;
    }

    // If there's an image uploaded, delete the old one and update with new one
    if (req.file && req.file.filename) {
      if (exitingUser.image) {
        const oldImagePath = path.join(__dirname, '../public/staff_porfile', exitingUser.image);
        try {
          fs.unlinkSync(oldImagePath); // Synchronously delete the old image
          console.log('Old image deleted successfully.');
        } catch (err) {
          console.error('Error deleting old image:', err.message);
        }
      }

      updateData.image = req.file.filename;
    }

    const updatedStaff = await prisma.staff.update({
      where: { id: Number(id) },
      data: updateData,
    });

    const payload = {
      id: updatedStaff.id,
      firstname: updatedStaff.firstname,
      lastname: updatedStaff.lastname,
      phonenumber: updatedStaff.phonenumber,
      role: updatedStaff.role,
      status: updatedStaff.aviable,
      image: updatedStaff.image,
    };

    jwt.sign(payload, process.env.SECRET, { expiresIn: "1d" }, (err, token) => {
      if (err) {
        return res.status(500).json({ message: "Token error." });
      }
      res.send({ payload, token });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: `Server error.` });
  }
}
