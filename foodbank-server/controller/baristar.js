const prisma = require("../config/prisma");
const dayjs = require("dayjs");

exports.getSellandExpBaristar = async (req, res) => {
  try {
    const { startDate, endDate, branchId } = req.body;

    const start = new Date(`${startDate}T00:00:00+07:00`);
    const end = new Date(`${endDate}T23:59:59+07:00`);

    console.log(`startDate ${start}`);
    console.log(`endDate ${end}`);
    console.log(branchId);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).send("Invalid startDate or endDate");
    }

    const send = await prisma.tracksend.findMany({
      where: {
        sendAt: { gte: start, lte: end },
        branchId,
      },
      select: { sendCount: true, price: true },
    });

    const exp = await prisma.trackexp.findMany({
      where: {
        expAt: { gte: start, lte: end },
        branchId,
      },
      select: { expCount: true, price: true },
    });

    const totalSend = send.reduce(
      (sum, item) => sum + (item.price || 0) * (item.sendCount || 0),
      0
    );
    const totalExp = exp.reduce(
      (sum, item) => sum + (item.price || 0) * (item.expCount || 0),
      0
    );

    const percent =
      totalSend > 0 ? ((totalExp / totalSend) * 100).toFixed(2) : 0;

    return res.json({
      branchId,
      totalSend,
      totalExp,
      percent: Number(percent),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "server error." });
  }
};

exports.getOrderBaristar = async (req, res) => {
  try {
    const { branchId, orderDate } = req.body; // <-- receive orderDate

    if (!orderDate || !branchId) {
      return res
        .status(400)
        .json({ message: "branchId and orderDate are required" });
    }

    // 🕒 Convert incoming date string to start & end of that day (local or UTC as you prefer)
    const startOfDay = dayjs(orderDate).startOf("day").toDate();
    const endOfDay = dayjs(orderDate).endOf("day").toDate();

    // 🔍 Query orders for that specific branch and date
    const orders = await prisma.orderTrack.findMany({
      where: {
        orderDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        branchId: branchId,
      },
      include: {
        products: {
          include: {
            available: true,
          },
        },
        branch: true,
      },
    });

    return res.json(orders);
  } catch (err) {
    console.error("❌ getOrderBaristar error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};
