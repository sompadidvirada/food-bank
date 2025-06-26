const prisma = require("../config/prisma");

exports.checkTrackSell = async (req, res) => {
  try {
    const { sellDate, brachId } = req.body;

    if (!sellDate || !brachId) {
      return res
        .status(500)
        .json({ message: `Something went wrong. No Data.` });
    }

    const startofDay = new Date(sellDate);
    const endofDay = new Date(sellDate);
    startofDay.setUTCHours(0, 0, 0, 0);
    endofDay.setUTCHours(23, 59, 59, 999);

    const checkDate = await prisma.tracksell.findMany({
      where: {
        sellAt: {
          gte: startofDay,
          lt: endofDay,
        },
        branchId: Number(brachId),
      },
    });

    res.json(checkDate);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error` });
  }
};
