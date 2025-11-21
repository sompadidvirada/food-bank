const prisma = require("../config/prisma");
const dayjs = require("dayjs");
const { io } = require("../server");
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

exports.createCommentBaristar = async (req, res) => {
  try {
    const { description, productsId, branchId, staffId, title } = req.body;
    const files = req.files;

    if (
      !description ||
      !files ||
      !productsId ||
      !branchId ||
      !staffId ||
      !title
    ) {
      return res
        .status(400)
        .json({ message: "Data Is undefine or null, Try agian later." });
    }

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
        image: filename,
        publicUrl: `https://${process.env.SECREY_AWS_BUCKET_IMAGE_TRACK}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${filename}`,
      });
    }

    const ress = await prisma.baristarComment.create({
      data: {
        description: description,
        productsId: Number(productsId),
        branchId: Number(branchId),
        title: title,
        staffId: Number(staffId),
      },
      include: {
        branch: true,
        staff: true,
        product:true
      },
    });

    await prisma.imageReportBaristar.createMany({
      data: uploadedImages.map((img) => ({
        baristarCommentId: Number(ress.id),
        image: img.image,
      })),
    });

    io.emit("new-report-baristar", {
      id: ress.id,
      branchId: ress.branch.id,
      branch: ress.branch,
      date: ress.date,
      imageReportBaristar: uploadedImages,
      product: ress.product,
      productsId: ress.product.id,
      staff: ress.staff,
      staffId: ress.staff.id,
      title,
      description,
    });

    return res.status(200).json({
      message: "send the report success.",
      data: uploadedImages,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error." });
  }
};

exports.getreportBaristar = async (req, res) => {
  try {
    const { branchId, page, limit } = req.body;

    const skip = (page - 1) * limit;

    const comments = await prisma.baristarComment.findMany({
      where: {
        branchId: Number(branchId),
      },
      orderBy: {
        date: "desc", // newest first
      },
      skip: skip,
      take: Number(limit),
      include: {
        product: true,
        branch: true,
        staff: true,
        imageReportBaristar: true,
        commentNotificationReads: true,
      },
    });

    const total = await prisma.baristarComment.count({
      where: { branchId: Number(branchId) },
    });

    return res.json({
      data: comments,
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

exports.getAllReport = async (req, res) => {
  try {
    const { page, limit } = req.body;

    const skip = (page - 1) * limit;

    const allReports = await prisma.baristarComment.findMany({
      include: {
        product: true,
        branch: true,
        staff: true,
        imageReportBaristar: true,
      },
      skip: skip,
      take: Number(limit),
      orderBy: {
        date: "desc",
      },
    });

    const total = await prisma.baristarComment.count();

    return res.json({
      data: allReports,
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error." });
  }
};

exports.getReportFilterByStaffId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "staffId is required" });
    }

    const unreadReports = await prisma.baristarComment.findMany({
      where: {
        // NOT EXISTS read record for this staff
        commentNotificationReads: {
          none: {
            staffId: Number(id),
          },
        },
      },
      include: {
        product: true,
        branch: true,
        staff: true,
        imageReportBaristar: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return res.status(200).json(unreadReports);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

exports.updateUnreadReportAdmin = async (req, res) => {
  try {
    const { staffId, id } = req.body;

    if (!id || !staffId) {
      return res.status(400).json({ message: `emty value to update.` });
    }

    const checkExit = await prisma.commentNotificationRead.findFirst({
      where: {
        commentId: Number(id),
        staffId: Number(staffId),
      },
    });

    if (checkExit) {
      return res
        .status(200)
        .json({ message: `this report already read by this user.` });
    }
    const ress = await prisma.commentNotificationRead.create({
      data: {
        commentId: Number(id),
        staffId: Number(staffId),
      },
    });
    res.status(200).json({ message: `update success.`, data: ress });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};
