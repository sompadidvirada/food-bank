const prisma = require("../config/prisma");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

exports.dashboradData = async (req, res) => {
  try {
    const { startDate, endDate, branchs } = req.body;
    // === Normalize start & end in UTC ===
    const start = dayjs(startDate).utc().startOf("day").toDate();
    const end = dayjs(endDate).utc().endOf("day").toDate();

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

    // === 2. Calculate last month start and end correctly ===
    function getLastMonth(date, isEnd = false) {
      let d = dayjs(date).utc().subtract(1, "month");

      // If the original date is the last day of its month,
      // move the last month date to the end of its month as well.
      const originalIsLastDay = dayjs(date).utc().isSame(
        dayjs(date).utc().endOf("month"),
        "day"
      );
      if (originalIsLastDay) {
        d = d.endOf("month");
      }

      if (isEnd) {
        return d.endOf("day").toDate();
      } else {
        return d.startOf("day").toDate();
      }
    }

    const lastStart = getLastMonth(start);
    const lastEnd = getLastMonth(end, true);

    // === 3. Query last month ===
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

    // === 4. Calculate totals ===
    const totalSendPrice = sendTrack.reduce(
      (sum, r) => sum + r.sendCount * (r.price || r.sellPrice || 0),
      0
    );

    const totalSellPrice = sellTrack.reduce(
      (sum, r) => sum + r.sellCount * (r.sellPrice || r.price || 0),
      0
    );

    const totalExpPrice = expTrack.reduce(
      (sum, r) => sum + r.expCount * (r.price || r.sellPrice || 0),
      0
    );

    const totalSendPriceLast = sendTrackLast.reduce(
      (sum, r) => sum + r.sendCount * (r.price || r.sellPrice || 0),
      0
    );

    const totalSellPriceLast = sellTrackLast.reduce(
      (sum, r) => sum + r.sellCount * (r.sellPrice || r.price || 0),
      0
    );

    const totalExpPriceLast = expTrackLast.reduce(
      (sum, r) => sum + r.expCount * (r.price || r.sellPrice || 0),
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

    // === 5. Return both current & last month ===
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
    return res.status(500).json({ message: "server error" });
  }
};
