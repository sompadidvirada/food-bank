const prisma = require("../config/prisma");

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ message: `Can't create with emty category value.` });
    }
    const categoryCreate = await prisma.category.create({
      data: {
        name: name,
      },
    });
    res
      .status(200)
      .json({ message: `Create Category Success.`, data: categoryCreate });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error` });
  }
};

exports.getCategorys = async (req, res) => {
  try {
    const Categorys = await prisma.category.findMany();
    res
      .status(200)
      .json({ message: "Get Categorys Success.", data: Categorys });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ messgae: `server error` });
  }
};

exports.deleteCategory = async (req,res) => {
  try {
    const {id} = req.params
    if(!id) {
      return res.status(400).json({ message: `cant'delete with emty value id`})
    }
    const ress = await prisma.category.delete({
      where: {
        id: Number(id)
      }
    })
    res.status(200).json({ message: `delete category success`, data: ress})
  }catch(err) {
    console.log(err)
    res.status(500).json({ message: `server error.`})
  }
}
