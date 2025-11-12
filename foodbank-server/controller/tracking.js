const prisma = require("../config/prisma");
const { parseISO, format } = require("date-fns");
const { utcToZonedTime } = require("date-fns-tz");
const timeZone = "Asia/Vientiane";
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.SECREY_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SECREY_AWS_SECRET_ACCESS_KEY,
  },
});

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
    const { sellCount, sellAt, userId, productId, brachId, price, sellPrice } = req.body;
    if (!sellCount || !sellAt || !brachId || !userId || !productId || !price || !sellPrice) {
      return res.status(400).json({ message: "something went wrong11." });
    }
    const formattedsellAt = parseISO(sellAt); // already in UTC
    const localDate = utcToZonedTime(formattedsellAt, timeZone);
    const sellDay = format(localDate, "EEEE");
    
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
          price: Number(price),
          sellPrice:Number(sellPrice)
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
    const { sendCount, sendAt, userId, productId, brachId, price, sellPrice } = req.body;
    console.log(req.body)
    if (!sendCount || !sendAt || !brachId || !userId || !productId || !price || !sellPrice) {
      return res.status(400).json({ message: "something went wrong11." });
    }
    const formattedsendAt = parseISO(sendAt); // already in UTC
    const localDate = utcToZonedTime(formattedsendAt, timeZone);
    const sendDay = format(localDate, "EEEE");

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
          price: Number(price),
          sellPrice:Number(sellPrice)
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
    const { expCount, expAt, userId, productId, brachId, price, sellPrice } = req.body;
    if (!expCount || !expAt || !brachId || !userId || !productId || !price || !sellPrice) {
      return res.status(400).json({ message: "something went wrong11." });
    }
    const formattedexpAt = parseISO(expAt); // already in UTC
    const localDate = utcToZonedTime(formattedexpAt, timeZone);
    const expDay = format(localDate, "EEEE");

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
          price: Number(price),
          sellPrice: Number(sellPrice)
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
    if (dateToDelete < sevenDaysAgo && req.user.role !== "admin") {
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

{
  /** image tracking */
}

exports.uploadImageTrack = async (req, res) => {
  try {
    const { branchId, Datetime } = req.body;
    const files = req.files;

    if (!branchId || !Datetime || !files || files.length === 0) {
      return res.status(400).json({ message: "Invalid or missing values." });
    }

    // Upload each file to S3
    const uploadedImages = [];

    for (const file of files) {
      const filename = `${Date.now()}-${file.originalname.replace(/\s/g, "_")}`;

      const command = new PutObjectCommand({
        Bucket: process.env.SECREY_AWS_BUCKET_IMAGE_TRACK,
        Key: filename,
        Body: file.buffer,
        ContentType: file.mimetype,
        CacheControl: "public, max-age=31536000, immutable",
      });

      await s3.send(command);

      uploadedImages.push({
        imageName: filename,
        publicUrl: `https://${process.env.SECREY_AWS_BUCKET_IMAGE_TRACK}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${filename}`,
      });
    }

    // Save to DB
    await prisma.imageTrack.createMany({
      data: uploadedImages.map((img) => ({
        branchId: Number(branchId),
        date: new Date(Datetime),
        imageName: img.imageName,
      })),
    });

    return res.status(200).json({
      message: "Images uploaded successfully",
      data: uploadedImages,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.checkImageTrack = async (req, res) => {
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

    const images = await prisma.imageTrack.findMany({
      where: {
        date: {
          gte: startofDay,
          lt: endofDay,
        },
        branchId: Number(brachId),
      },
    });

    res.send(images);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

exports.deleteImages = async (req, res) => {
  try {
    const { images, date, branchId } = req.body;

    if (!images || !date || !branchId) {
      return res.status(400).json({ message: `emty value.` });
    }

    const keysToDelete = req.body.images;

    const params = {
      Bucket: process.env.SECREY_AWS_BUCKET_IMAGE_TRACK,
      Delete: {
        Objects: keysToDelete.map((key) => ({ Key: key })),
        Quiet: false, // set to true to suppress response for each object
      },
    };
    const command = new DeleteObjectsCommand(params);
    await s3.send(command);

    const startofDay = new Date(date);
    const endofDay = new Date(date);
    startofDay.setUTCHours(0, 0, 0, 0);
    endofDay.setUTCHours(23, 59, 59, 999);

    const checkImageInDatabase = await prisma.imageTrack.findMany({
      where: {
        date: {
          gte: startofDay,
          lt: endofDay,
        },
        branchId: Number(branchId),
      },
    });

    if (checkImageInDatabase.length > 0) {
      await prisma.imageTrack.deleteMany({
        where: {
          date: {
            gte: startofDay,
            lt: endofDay,
          },
          branchId: Number(branchId),
        },
      });
    }
    return res.status(200).json({ message: "Images deleted successfully." });
  } catch (err) {
    console.log(err);
    return res.status(err).json({ message: `server error.` });
  }
};

exports.fecthImageTrack = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    const ress = await prisma.imageTrack.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
    });
    res.send(ress)
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error` });
  }
};
