const prisma = require("../config/prisma");

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

exports.updateRoleStaff = async (req,res) => {
  try {
    const {id}= req.params
    const {role} = req.body

    if(!id || !role) {
      return res.status(400).json({message: `Can't update role with emty value.`})
    }

    const respone = await prisma.staff.update({
      where: {
        id: Number(id)
      }, data : {
        role: role
      }
    })
    res.send(respone)
  }catch(err) {
    console.log(err)
    return res.status(500).json({ message : `server error.`})
  }
}
