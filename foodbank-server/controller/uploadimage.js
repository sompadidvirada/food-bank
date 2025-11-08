const prisma = require("../config/prisma");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.SECREY_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SECREY_AWS_SECRET_ACCESS_KEY,
  },
});

// controller
exports.uploadProductImage = async (req, res) => {
  try {
    const { imageName, contentType } = req.body;

    if (!imageName || !contentType) {
      return res
        .status(400)
        .json({ message: "Missing imageName or contentType" });
    }

    const command = new PutObjectCommand({
      Bucket: process.env.SECREY_AWS_BUCKET_STAFF,
      Key: imageName,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 minutes
    if (!url) {
      return res.status(500).json({ message: `Soemthing went wrong.` });
    }
    res.json({ uploadUrl: url });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.checkUploadImageAllBranch = async (req, res) => {
  try {
    const { checkDate } = req.body;

    console.log(checkDate)
    const startofDay = new Date(checkDate);
    const endofDay = new Date(checkDate);
    startofDay.setUTCHours(0, 0, 0, 0);
    endofDay.setUTCHours(23, 59, 59, 999);

    const images = await prisma.imageTrack.findMany({
      where: {
        date: {
          gte: startofDay,
          lte: endofDay,
        },
      },
    });
    res.send(images);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};
