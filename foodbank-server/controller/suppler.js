const prisma = require("../config/prisma");

exports.createSuppler = async (req, res) => {
  const { order_range_date, name } = req.body;
    console.log(req.body)
  if (!order_range_date || !name) {
    return res.status(400).json({ message: `emty value.` });
  }
  try {
    const ress = await prisma.suppler_bakery.create({
      data: {
        name: name,
        order_range_date: Number(order_range_date),
      },
    });
    res.status(200).json(ress)
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

exports.getAllSupplter = async (req,res) => {
  try{
    const ress = await prisma.suppler_bakery.findMany()
    res.json(ress)
  }catch(err) {
    console.log(err)
    return res.status(500).json({message: `server error.`})
  }
}