const prisma = require("../config/prisma");
const { parseISO, format } = require("date-fns");

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
exports.checkTrackSend = async (req, res) => {
  try {
    const { sendDate, brachId } = req.body;

    if (!sendDate || !brachId) {
      return res
        .status(500)
        .json({ message: `Something went wrong. No Data.` });
    }

    const startofDay = new Date(sendDate);
    const endofDay = new Date(sendDate);
    startofDay.setUTCHours(0, 0, 0, 0);
    endofDay.setUTCHours(23, 59, 59, 999);

    const checkDate = await prisma.tracksend.findMany({
      where: {
        sendAt: {
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
exports.checkTrackExp = async (req, res) => {
  try {
    const { expDate, brachId } = req.body;

    if (!expDate || !brachId) {
      return res
        .status(500)
        .json({ message: `Something went wrong. No Data.` });
    }
    const startofDay = new Date(expDate);
    const endofDay = new Date(expDate);
    startofDay.setUTCHours(0, 0, 0, 0);
    endofDay.setUTCHours(23, 59, 59, 999);

    const checkDate = await prisma.trackexp.findMany({
      where: {
        expAt: {
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

exports.insertTrackSell = async (req, res) => {
  try {
    const { sellCount, sellAt, userId, productId, brachId } = req.body;
    console.log(req.body);
    if (!sellCount || !sellAt || !brachId || !userId || !productId) {
      return res.status(400).json({ message: "something went wrong11." });
    }
    const formattedsellAt = parseISO(sellAt); // already in UTC
    const sellDay = format(formattedsellAt, "EEEE");

    const start = new Date(formattedsellAt);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(formattedsellAt);
    end.setUTCHours(23, 59, 59, 999);

    const check = await prisma.tracksell.findFirst({
      where: {
        sellAt: {
          gte: start,
          lte: end,
        },
        branchId: Number(brachId),
        productsId: Number(productId),
      },
    });

    if (check) {
      return res.status(400).json({ message: `This item's already updated.` });
    }

    const insertTrack = await prisma.$transaction(async (tx) => {
      const ress = await prisma.tracksell.create({
        data: {
          sellCount: Number(sellCount),
          sellAt: formattedsellAt,
          sellDay: sellDay,
          productsId: Number(productId),
          staffId: Number(userId),
          branchId: Number(brachId),
        },
      });
      return ress;
    });
    res.send(insertTrack);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};
exports.insertTrackSend = async (req, res) => {
  try {
    const { sendCount, sendAt, userId, productId, brachId } = req.body;
    console.log(req.body);
    if (!sendCount || !sendAt || !brachId || !userId || !productId) {
      return res.status(400).json({ message: "something went wrong11." });
    }
    const formattedsendAt = parseISO(sendAt); // already in UTC
    const sendDay = format(formattedsendAt, "EEEE");

    const start = new Date(formattedsendAt);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(formattedsendAt);
    end.setUTCHours(23, 59, 59, 999);

    const check = await prisma.tracksend.findFirst({
      where: {
        sendAt: {
          gte: start,
          lte: end,
        },
        branchId: Number(brachId),
        productsId: Number(productId),
      },
    });

    if (check) {
      return res.status(400).json({ message: `This item's already updated.` });
    }

    const insertTrack = await prisma.$transaction(async (tx) => {
      const ress = await prisma.tracksend.create({
        data: {
          sendCount: Number(sendCount),
          sendAt: formattedsendAt,
          sendDay: sendDay,
          productsId: Number(productId),
          staffId: Number(userId),
          branchId: Number(brachId),
        },
      });
      return ress;
    });
    res.send(insertTrack);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};
exports.insertTrackExp = async (req, res) => {
  try {
    const { expCount, expAt, userId, productId, brachId } = req.body;
    console.log(req.body);
    if (!expCount || !expAt || !brachId || !userId || !productId) {
      return res.status(400).json({ message: "something went wrong11." });
    }
    const formattedexpAt = parseISO(expAt); // already in UTC
    const expDay = format(formattedexpAt, "EEEE");

    const start = new Date(formattedexpAt);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(formattedexpAt);
    end.setUTCHours(23, 59, 59, 999);

    const check = await prisma.trackexp.findFirst({
      where: {
        expAt: {
          gte: start,
          lte: end,
        },
        branchId: Number(brachId),
        productsId: Number(productId),
      },
    });

    if (check) {
      return res.status(400).json({ message: `This item's already updated.` });
    }

    const insertTrack = await prisma.$transaction(async (tx) => {
      const ress = await prisma.trackexp.create({
        data: {
          expCount: Number(expCount),
          expAt: formattedexpAt,
          expDay: expDay,
          productsId: Number(productId),
          staffId: Number(userId),
          branchId: Number(brachId),
        },
      });
      return ress;
    });
    res.send(insertTrack);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

exports.deleteTracksell = async (req, res) => {
  try {
    const { sellDate, brachId } = req.body;
    if (!sellDate || !brachId) {
      return res.status(400).json({ message: `Missing Data.` });
    }

    const dateToDelete = new Date(sellDate);
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    // Prevent deletion if sellDate is older than 7 days
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

    const startOfDay = new Date(sellDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(sellDate);
    endOfDay.setHours(23, 59, 59, 999);

    await prisma.tracksell.deleteMany({
      where: {
        branchId: Number(brachId),
        sellAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    res.status(200).json({ message: "Delete success." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `Server error.` });
  }
};

exports.deleteTracksend = async (req, res) => {
  try {
    const { sendDate, brachId } = req.body;
    if (!sendDate || !brachId) {
      return res.status(400).json({ message: `Missing Data.` });
    }

    const dateToDelete = new Date(sendDate);
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    // Prevent deletion if sellDate is older than 7 days
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

    const startOfDay = new Date(sendDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(sendDate);
    endOfDay.setHours(23, 59, 59, 999);

    await prisma.tracksend.deleteMany({
      where: {
        branchId: Number(brachId),
        sendAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });
    res.status(200).json({ message: "Delete success." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};
exports.deleteTrackexp = async (req, res) => {
  try {
    const { expDate, brachId } = req.body;
    if (!expDate || !brachId) {
      return res.status(400).json({ message: `Missing Data.` });
    }

    const dateToDelete = new Date(expDate);
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    // Prevent deletion if sellDate is older than 7 days
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

    const startOfDay = new Date(expDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(expDate);
    endOfDay.setHours(23, 59, 59, 999);

    await prisma.trackexp.deleteMany({
      where: {
        branchId: Number(brachId),
        expAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });
    res.status(200).json({ message: "Delete success." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

exports.updateTrackSell = async (req, res) => {
  try {
    const { sellAt, productId, brachId, sellCount } = req.body;

    const dateToDelete = new Date(sellAt);
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    // Prevent deletion if sellDate is older than 7 days
    if (dateToDelete < sevenDaysAgo) {
      return res
        .status(403)
        .json({ message: "ບໍ່ສາມາດແກ້ໄຂລາຍການທີ່ກາຍ 7 ວັນໄດ້." });
    }
    // Set range for the whole day
    const startOfDay = new Date(sellAt);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(sellAt);
    endOfDay.setHours(23, 59, 59, 999);

    const ress = await prisma.tracksell.updateMany({
      where: {
        productsId: Number(productId),
        branchId: Number(brachId),
        sellAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      data: {
        sellCount: Number(sellCount),
      },
    });
    res.send(ress);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};
exports.updateTrackSend = async (req, res) => {
  try {
    const { sendAt, productId, brachId, sendCount } = req.body;

    const dateToDelete = new Date(sendAt);
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    // Prevent deletion if sellDate is older than 7 days
    if (dateToDelete < sevenDaysAgo) {
      return res
        .status(403)
        .json({ message: "ບໍ່ສາມາດແກ້ໄຂລາຍການທີ່ກາຍ 7 ວັນໄດ້." });
    }
    // Set range for the whole day
    const startOfDay = new Date(sendAt);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(sendAt);
    endOfDay.setHours(23, 59, 59, 999);

    const ress = await prisma.tracksend.updateMany({
      where: {
        productsId: Number(productId),
        branchId: Number(brachId),
        sendAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      data: {
        sendCount: Number(sendCount),
      },
    });
    res.send(ress);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};
exports.updateTrackExp = async (req, res) => {
  try {
    const { expAt, productId, brachId, expCount } = req.body;

    const dateToDelete = new Date(expAt);
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    // Prevent deletion if sellDate is older than 7 days
    if (dateToDelete < sevenDaysAgo) {
      return res
        .status(403)
        .json({ message: "ບໍ່ສາມາດແກ້ໄຂລາຍການທີ່ກາຍ 7 ວັນໄດ້." });
    }
    // Set range for the whole day
    const startOfDay = new Date(expAt);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(expAt);
    endOfDay.setHours(23, 59, 59, 999);

    const ress = await prisma.trackexp.updateMany({
      where: {
        productsId: Number(productId),
        branchId: Number(brachId),
        expAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      data: {
        expCount: Number(expCount),
      },
    });
    res.send(ress);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};
