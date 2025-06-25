const prisma = require("../config/prisma");

exports.createBranch = async (req, res) => {
  try {
    const { branchName } = req.body;
    if (!branchName) {
      return res.status(400).json({ message: `Can't create with emty value.` });
    }
    const createB = await prisma.branch.create({
      data: {
        branchname: branchName,
      },
    });
    res.send(createB);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

exports.getBranchs = async (req,res) => {
    try{

        const getAllBranch = await prisma.branch.findMany()
        res.send(getAllBranch)
    }catch(err) {
        console.log(err)
        return res.status(500).json({ message: `server error`})
    }
}

exports.updateBranchLocation = async  (req,res) => {
  try{
    const {id} = req.params
    const {latitude, longitude} = req.body
    if (!latitude || !longitude || !id) {
      return res.status(400).json({message: `Cant update with emty value.`})
    }

    const updateLocation = await prisma.branch.update({
      where: {
        id: Number(id)
      }, data: {
        latitude,
        longitude
      }
    })
    res.status(200).json(updateLocation);

  }catch(err) {
    console.log(err)
    res.status(500).json({message: `server error`})
  }
} 