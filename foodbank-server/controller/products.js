const prisma = require("../config/prisma");
const fs = require("fs");
const path = require("path");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.SECREY_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SECREY_AWS_SECRET_ACCESS_KEY,
  },
});

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      sellprice,
      lifetime,
      category,
      productImage,
      contentType,
    } = req.body;

    if (!name || !price || !sellprice || !lifetime || !category) {
      return res
        .status(400)
        .json({ message: `Can't create product with emty value.` });
    }

    // get URL from s3

    let imageUploadUrl = null;

    if (productImage) {
      const command = new PutObjectCommand({
        Bucket: process.env.SECREY_AWS_BUCKET_PRODUCTS,
        Key: productImage,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      });

      imageUploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

      if (!imageUploadUrl) {
        return res.status(500).json({ message: `Something went wrong.` });
      }
    }

    // get all branch prepare

    const allBranch = await prisma.branch.findMany();

    //start transaction

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.products.create({
        data: {
          name: name,
          price: Number(price),
          sellprice: Number(sellprice),
          lifetime: Number(lifetime),
          categoryId: Number(category),
          image: productImage,
        },
      });

      // prepare available product data
      const availableProductData = allBranch.map((branch) => ({
        productsId: product.id,
        branchId: branch.id,
      }));

      // create available product process...

      await tx.availableproduct.createMany({
        data: availableProductData,
        skipDuplicates: true,
      });

      return product;
    });
    res.send({ result, imageUploadUrl });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: `serrver error.` });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const allProduct = await prisma.products.findMany({
      include: {
        category: true,
        available: true,
        supplerBakery: true
      },
    });
    res.send(allProduct);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

exports.updatePerBrach = async (req, res) => {
  try {
    const productId = req.params.id;
    const { branchId, status } = req.body;

    if (!branchId) {
      // Update all branches for a product
      const response = await prisma.availableproduct.updateMany({
        where: {
          productsId: Number(productId),
        },
        data: {
          aviableStatus: status,
        },
      });
      return res.send(
        `Updated ${response.count} branches for product ${productId}.`
      );
    } else {
      // Update a specific product-branch pair
      const updates = await prisma.availableproduct.update({
        where: {
          productsId_branchId: {
            productsId: Number(productId),
            branchId: Number(branchId),
          },
        },
        data: {
          aviableStatus: status,
        },
      });
      return res.send(updates);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `Server error` });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      price,
      sellprice,
      categoryId,
      suppler_bakeryId,
      lifetime,
      status,
      imageName,
      contentType,
    } = req.body;

    if (!name || !price || !sellprice || !categoryId || !lifetime || !status) {
      return res.status(400).json({ message: `Can't update with emty value.` });
    }

    let imageUploadUrl = null;

    const exitingProduct = await prisma.products.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!exitingProduct) {
      return res.status(400).json({ message: `This item is not exit.` });
    }

    if (imageName) {
      if (exitingProduct.image) {
        try {
          const params = {
            Bucket: process.env.SECREY_AWS_BUCKET_PRODUCTS,
            Key: exitingProduct.image,
          };

          const command = new DeleteObjectCommand(params);
          await s3.send(command);

          console.log("Deleted old image:", exitingUser.image);
        } catch (err) {
          console.error("Error deleting old image:", err.message);
        }
      }

      const command = new PutObjectCommand({
        Bucket: process.env.SECREY_AWS_BUCKET_PRODUCTS,
        Key: imageName,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      });

      imageUploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
      if (!imageUploadUrl) {
        return res.status(500).json({ message: `Something went wrong.` });
      }
    }
    const updateProduct = await prisma.products.update({
      where: {
        id: Number(id),
      },
      data: {
        name: name,
        price: Number(price),
        sellprice: Number(sellprice),
        lifetime: Number(lifetime),
        status: status,
        categoryId: Number(categoryId),
        image: imageName,
        suppler_bakeryId: Number(suppler_bakeryId) ?? ""
      },
    });
    res.status(201).json({
      message: "Product update successfully!",
      user: updateProduct,
      imageUploadUrl,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: `server error.` });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ message: `Can't delete product with emty id.` });
    }
    const checkImg = await prisma.products.findFirst({
      where: {
        id: Number(id),
      },
    });
    if (checkImg.image) {
      try {
        const params = {
          Bucket: process.env.SECREY_AWS_BUCKET_PRODUCTS,
          Key: checkImg.image,
        };

        const command = new DeleteObjectCommand(params);
        await s3.send(command);

        console.log("Deleted old image:", checkImg.image);
      } catch (err) {
        console.error("Error deleting old image:", err.message);
      }
    }
    const de = await prisma.products.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json({ message: `Delete Product success.`, data: de });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};
