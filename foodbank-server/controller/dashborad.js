const prisma = require("../config/prisma");

exports.dashboradData = async (req, res) => {
  try {
    const { startDate, endDate, branchs } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).send("Invalid startDate or endDate");
    }

    // === 1. Query for current range ===
    const [sendTrack, expTrack, sellTrack] = await Promise.all([
      prisma.tracksend.findMany({
        where: {
          sendAt: { gte: start, lte: end },
          branchId: { notIn: branchs },
        },
        include: { products: true },
      }),
      prisma.trackexp.findMany({
        where: {
          expAt: { gte: start, lte: end },
          branchId: { notIn: branchs },
        },
        include: { products: true },
      }),
      prisma.tracksell.findMany({
        where: {
          sellAt: { gte: start, lte: end },
          branchId: { notIn: branchs },
        },
        include: { products: true },
      }),
    ]);

    // === 2. Shift dates to last month ===
    const lastStart = new Date(start);
    const lastEnd = new Date(end);
    lastStart.setMonth(lastStart.getMonth() - 1);
    lastEnd.setMonth(lastEnd.getMonth() - 1);

    const [sendTrackLast, expTrackLast, sellTrackLast] = await Promise.all([
      prisma.tracksend.findMany({
        where: {
          sendAt: { gte: lastStart, lte: lastEnd },
          branchId: { notIn: branchs },
        },
        include: { products: true },
      }),
      prisma.trackexp.findMany({
        where: {
          expAt: { gte: lastStart, lte: lastEnd },
          branchId: { notIn: branchs },
        },
        include: { products: true },
      }),
      prisma.tracksell.findMany({
        where: {
          sellAt: { gte: lastStart, lte: lastEnd },
          branchId: { notIn: branchs },
        },
        include: { products: true },
      }),
    ]);

    // === 3. Calculate totals ===
    const totalSendPrice = sendTrack.reduce(
      (sum, r) => sum + r.sendCount * (r.products?.price || 0),
      0
    );
    const totalSellPrice = sellTrack.reduce(
      (sum, r) => sum + r.sellCount * (r.products?.price || 0),
      0
    );
    const totalExpPrice = expTrack.reduce(
      (sum, r) => sum + r.expCount * (r.products?.price || 0),
      0
    );

    const totalSendPriceLast = sendTrackLast.reduce(
      (sum, r) => sum + r.sendCount * (r.products?.price || 0),
      0
    );
    const totalSellPriceLast = sellTrackLast.reduce(
      (sum, r) => sum + r.sellCount * (r.products?.price || 0),
      0
    );
    const totalExpPriceLast = expTrackLast.reduce(
      (sum, r) => sum + r.expCount * (r.products?.price || 0),
      0
    );

    const percentageOfPricetotalExp =
      totalSendPrice > 0
        ? parseFloat(((totalExpPrice / totalSendPrice) * 100).toFixed(2))
        : 0;

    const percentageOfPricetotalExpLast =
      totalSendPriceLast > 0
        ? parseFloat(
            ((totalExpPriceLast / totalSendPriceLast) * 100).toFixed(2)
          )
        : 0;

    // === 4. Return both current & last month ===
    res.json({
      current: {
        totalSendPrice,
        totalSellPrice,
        totalExpPrice,
        percentageOfPricetotalExp,
      },
      lastMonth: {
        totalSendPriceLast,
        totalSellPriceLast,
        totalExpPriceLast,
        percentageOfPricetotalExpLast,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error` });
  }
};
