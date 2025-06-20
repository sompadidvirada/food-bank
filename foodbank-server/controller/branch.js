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
