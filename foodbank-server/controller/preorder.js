const prisma = require("../config/prisma");
const { parseISO, format, startOfDay, subDays, endOfDay } = require("date-fns");
const { utcToZonedTime, zonedTimeToUtc } = require("date-fns-tz");
const timeZone = "Asia/Vientiane";

exports.createPreorder = async (req, res) => {
  try {
    const { orderCount, orderDate, userId, productId, brachId } = req.body;
    if (!orderCount || !orderDate || !userId || !productId || !brachId) {
      return res.status(400).json({ message: `emtyvalue.` });
    }

    const formattedOrderAt = parseISO(orderDate); // already in UTC

    const ress = await prisma.orderTrack.create({
      data: {
        orderCount,
        orderDate: formattedOrderAt,
        productsId: productId,
        branchId: brachId,
      },
    });
    res.send(ress);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

exports.checkOrder = async (req, res) => {
  try {
    const { orderDate, brachId } = req.body;
    if (!orderDate || !brachId) {
      return res
        .status(500)
        .json({ message: `Something went wrong. No Data.` });
    }
    const startofDay = new Date(orderDate);
    const endofDay = new Date(orderDate);
    startofDay.setUTCHours(0, 0, 0, 0);
    endofDay.setUTCHours(23, 59, 59, 999);

    const ress = await prisma.orderTrack.findMany({
      where: {
        orderDate: {
          gte: startofDay,
          lt: endofDay,
        },
        branchId: Number(brachId),
      },
    });
    res.send(ress);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error` });
  }
};

exports.updateOrderTrack = async (req, res) => {
  try {
    console.log(req.params)
    const { id } = req.params;
    const { orderCount } = req.body;

    const update = await prisma.orderTrack.update({
      where: {
        id: Number(id),
      },
      data: {
        orderCount: Number(orderCount),
      },
    });
    res.send(update);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};
exports.updateOrderWant = async (req, res) => {
  try {
    const now = new Date();

    // Convert to Laos time (UTC+7)
    const laosHour = (now.getUTCHours() + 7) % 24;
    const laosMinute = now.getUTCMinutes();

    // Block if Laos time is 11:30 or later
    if (laosHour > 11 || (laosHour === 11 && laosMinute >= 50)) {
      return res
        .status(403)
        .json({ message: "Updates are not allowed after 11:30 AM Laos time" });
    }

    const { id } = req.params;
    const { orderWant } = req.body;
    const chaneg = await prisma.orderTrack.update({
      where: {
        id: Number(id),
      },
      data: {
        orderWant: Number(orderWant),
      },
    });
    res.send(chaneg);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error` });
  }
};
exports.deleteOrder = async (req, res) => {
  try {
    const { orderDate, brachId } = req.body;
    if (!orderDate || !brachId) {
      return res.status(400).json({ message: `Missing Data.` });
    }
    const dateToDelete = new Date(orderDate);
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    if (dateToDelete < sevenDaysAgo) {
      const checkRole = await prisma.staff.findFirst({
        where: {
          id: Number(req.user.id),
        },
      });
      if (checkRole.role !== "admin") {
        return res
          .status(403)
          .json({ message: "ຢູເຊີພະນັກງານບໍ່ສາມາດລົບລາຍການທີ່ກາຍ 7 ວັນໄດ້." });
      }
    }
    const startOfDay = new Date(orderDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(orderDate);
    endOfDay.setHours(23, 59, 59, 999);

    await prisma.orderTrack.deleteMany({
      where: {
        branchId: Number(brachId),
        orderDate: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });
    res.status(200).json({ message: "Delete success." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error` });
  }
};
function createRange(startDate, endDate) {
  // startDate and endDate are in Asia/Vientiane timezone date objects

  // Convert to start and end of day in the timezone
  const startZoned = startOfDay(startDate);
  const endZoned = endOfDay(endDate);

  // Convert those zoned times back to UTC for querying DB
  const startUtc = zonedTimeToUtc(startZoned, timeZone);
  const endUtc = zonedTimeToUtc(endZoned, timeZone);

  return { start: startUtc, end: endUtc };
}

exports.getPassThreeWeekTrack = async (req, res) => {
  try {
    const { orderDate, brachId } = req.body;

    const utcDate = parseISO(orderDate);
    const localDate = startOfDay(utcToZonedTime(utcDate, timeZone)); // ✅ Ensure Lao calendar day
    const dayName = format(localDate, "EEEE");

    if (dayName !== "Saturday" && dayName !== "Wednesday") {
      return res
        .status(400)
        .json({ message: "Only Wednesday or Saturday allowed." });
    }

    const weekRanges = [];

    if (dayName === "Wednesday") {
      weekRanges.push(
        createRange(subDays(localDate, 4), subDays(localDate, 1))
      ); // 23–26
      weekRanges.push(
        createRange(subDays(localDate, 7), subDays(localDate, 5))
      ); // 20–22
      weekRanges.push(
        createRange(subDays(localDate, 11), subDays(localDate, 8))
      ); // 16–19
    }

    if (dayName === "Saturday") {
      weekRanges.push(
        createRange(subDays(localDate, 3), subDays(localDate, 1))
      ); // 25–27
      weekRanges.push(
        createRange(subDays(localDate, 7), subDays(localDate, 4))
      ); // 22–24
      weekRanges.push(
        createRange(subDays(localDate, 10), subDays(localDate, 8))
      ); // 18–21
    }

    // 🔍 Optional debug log
    console.log("📅 Week Ranges:");
    weekRanges.forEach((r, i) => {
      console.log(
        `Week ${i + 1}: ${format(r.start, "yyyy-MM-dd")} to ${format(
          r.end,
          "yyyy-MM-dd"
        )}`
      );
    });

    const products = await prisma.tracksend.findMany({
      where: { branchId: brachId },
      select: { productsId: true },
      distinct: ["productsId"],
    });

    const results = [];

    for (const product of products) {
      const productId = product.productsId;
      const productData = {
        productId,
        branchId: brachId,
      };

      for (let i = 0; i < 3; i++) {
        const { start, end } = weekRanges[i];

        const [sendSum, sellSum, expSum] = await Promise.all([
          prisma.tracksend.aggregate({
            _sum: { sendCount: true },
            where: {
              branchId: brachId,
              productsId: productId,
              sendAt: { gte: start, lte: end },
            },
          }),
          prisma.tracksell.aggregate({
            _sum: { sellCount: true },
            where: {
              branchId: brachId,
              productsId: productId,
              sellAt: { gte: start, lte: end },
            },
          }),
          prisma.trackexp.aggregate({
            _sum: { expCount: true },
            where: {
              branchId: brachId,
              productsId: productId,
              expAt: { gte: start, lte: end },
            },
          }),
        ]);

        productData[`week${i + 1}Send`] = sendSum._sum.sendCount || 0;
        productData[`week${i + 1}Sell`] = sellSum._sum.sellCount || 0;
        productData[`week${i + 1}Exp`] = expSum._sum.expCount || 0;
      }

      results.push(productData);
    }

    return res.status(200).json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
};

exports.getAllORderTrack = async (req, res) => {
  try {
    const { orderDate } = req.body;
    if (!orderDate) {
      return res
        .status(500)
        .json({ message: `Something went wrong. No Data.` });
    }
    const startofDay = new Date(orderDate);
    const endofDay = new Date(orderDate);
    startofDay.setUTCHours(0, 0, 0, 0);
    endofDay.setUTCHours(23, 59, 59, 999);

    const ress = await prisma.orderTrack.findMany({
      where: {
        orderDate: {
          gte: startofDay,
          lt: endofDay,
        },
      },
      include: {
        branch: true,
      },
    });
    res.send(ress);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error` });
  }
};

exports.confirmOrder = async (req, res) => {
  try {
    const { orderDate, brachId } = req.body;
    if (!orderDate || !brachId) {
      return res.status(400).json({ message: `emty value.` });
    }
    const formattedOrderAt = parseISO(orderDate); // already in UTC

    const startofDay = new Date(orderDate);
    const endofDay = new Date(orderDate);
    startofDay.setUTCHours(0, 0, 0, 0);
    endofDay.setUTCHours(23, 59, 59, 999);

    const check = await prisma.confirmOrder.findFirst({
      where: {
        branchId: Number(brachId),
        confirmDate: {
          gte: startofDay,
          lt: endofDay,
        },
      },
    });
    if (check) {
      const update = await prisma.confirmOrder.update({
        where: {
          id: Number(check.id),
        },
        data: {
          status: true,
        },
      });
      return res.send(update);
    }
    const ress = await prisma.confirmOrder.create({
      data: {
        confirmDate: formattedOrderAt,
        branchId: Number(brachId),
      },
    });
    res.send(ress);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

exports.checkConfirmOrderPerBranch = async (req, res) => {
  try {
    const { orderDate, brachId } = req.body;
    if (!orderDate || !brachId) {
      return res
        .status(500)
        .json({ message: `Something went wrong. No Data.` });
    }
    const startofDay = new Date(orderDate);
    const endofDay = new Date(orderDate);
    startofDay.setUTCHours(0, 0, 0, 0);
    endofDay.setUTCHours(23, 59, 59, 999);

    const ress = await prisma.confirmOrder.findFirst({
      where: {
        confirmDate: {
          gte: startofDay,
          lt: endofDay,
        },
        branchId: Number(brachId),
      },
    });
    res.send(ress);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

exports.checkConfirmOrderAll = async (req, res) => {
  try {
    const { orderDate } = req.body;
    if (!orderDate) {
      return res
        .status(500)
        .json({ message: `Something went wrong. No Data.` });
    }
    const startofDay = new Date(orderDate);
    const endofDay = new Date(orderDate);
    startofDay.setUTCHours(0, 0, 0, 0);
    endofDay.setUTCHours(23, 59, 59, 999);

    const ress = await prisma.confirmOrder.findMany({
      where: {
        confirmDate: {
          gte: startofDay,
          lt: endofDay,
        },
      },
    });
    res.send(ress);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

exports.changeStatusConfirmOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!id || status) {
      return res.status(400).json({ message: `emty value` });
    }
    const ress = await prisma.confirmOrder.update({
      where: {
        id: Number(id),
      },
      data: {
        status: status,
        confirmStatus: false
      },
    });
    res.send(ress);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

exports.confirmOrderChange = async (req,res) => {
  try{
    const {id} = req.params
    const { status } = req.body
    console.log(id, status)
    if(!id || status === undefined ) {
      return res.status(400).json({ message: `emty value.`})
    }
    const ress = await prisma.confirmOrder.update({
      where: {
        id: Number(id)
      }, data: {
        confirmStatus: status
      }
    })
    res.send(ress)
  }catch(err) {
    console.log(err)
    return res.status(500).json({ message: `server error`})
  }
}