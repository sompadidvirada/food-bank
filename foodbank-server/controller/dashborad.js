const prisma = require("../config/prisma");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

exports.dashboradData = async (req, res) => {
  try {
    const { startDate, endDate, branchs } = req.body;

    const start = dayjs(startDate).utc().startOf("day").toDate();
    const end = dayjs(endDate).utc().endOf("day").toDate();

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).send("Invalid startDate or endDate");
    }

    // 1. Fetch data for both periods
    const [sendTrack, expTrack, sellTrack] = await Promise.all([
      prisma.tracksend.findMany({
        where: {
          sendAt: { gte: start, lte: end },
          branchId: { notIn: branchs },
        },
      }),
      prisma.trackexp.findMany({
        where: {
          expAt: { gte: start, lte: end },
          branchId: { notIn: branchs },
        },
      }),
      prisma.tracksell.findMany({
        where: {
          sellAt: { gte: start, lte: end },
          branchId: { notIn: branchs },
        },
      }),
    ]);

    function getLastMonth(date, isEnd = false) {
      let d = dayjs(date).utc().subtract(1, "month");
      const originalIsLastDay = dayjs(date)
        .utc()
        .isSame(dayjs(date).utc().endOf("month"), "day");
      if (originalIsLastDay) d = d.endOf("month");
      return isEnd ? d.endOf("day").toDate() : d.startOf("day").toDate();
    }

    const lastStart = getLastMonth(start);
    const lastEnd = getLastMonth(end, true);

    const [sendTrackLast, expTrackLast, sellTrackLast] = await Promise.all([
      prisma.tracksend.findMany({
        where: {
          sendAt: { gte: lastStart, lte: lastEnd },
          branchId: { notIn: branchs },
        },
      }),
      prisma.trackexp.findMany({
        where: {
          expAt: { gte: lastStart, lte: lastEnd },
          branchId: { notIn: branchs },
        },
      }),
      prisma.tracksell.findMany({
        where: {
          sellAt: { gte: lastStart, lte: lastEnd },
          branchId: { notIn: branchs },
        },
      }),
    ]);

    // 2. Updated Calculation Logic
    // We now sum the 'sellPrice' and 'price' fields directly from the records

    const totalSendPrice = sendTrack.reduce(
      (sum, r) => sum + (r.sendCount * r.price || 0),
      0
    );
    const totalSellPrice = sellTrack.reduce(
      (sum, r) => sum + (r.sellCount * r.sellPrice || 0),
      0
    );
    const totalExpPrice = expTrack.reduce((sum, r) => sum + (r.expCount * r.price || 0), 0);

    const totalSendPriceLast = sendTrackLast.reduce(
      (sum, r) => sum + (r.sendCount * r.price || 0),
      0
    );
    const totalSellPriceLast = sellTrackLast.reduce(
      (sum, r) => sum + (r.sellCount * r.sellPrice || 0),
      0
    );
    const totalExpPriceLast = expTrackLast.reduce(
      (sum, r) => sum + (r.expCount * r.price),
      0
    );

    // 3. Percentages
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
