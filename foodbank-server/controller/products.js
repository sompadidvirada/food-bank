const prisma = require("../config/prisma");
const fs = require("fs");
const path = require("path");

exports.createProduct = async (req, res) => {
  try {
    const { name, price, sellprice, lifetime, category } = req.body;
    console.log(req.body)
    if (!name || !price || !sellprice || !lifetime || !category) {
      return res
        .status(400)
        .json({ message: `Can't create product with emty value.` });
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
          image: req?.file?.filename || "",
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
    res.send(result);
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
    const { name, price, sellprice, categoryId, lifetime } = req.body;
    if (!name || !price || !sellprice || !categoryId || !lifetime) {
      return res.status(400).json({ message: `Can't update with emty value.` });
    }
    if (!req.file || !req.file.filename) {
      const updateProduct = await prisma.products.update({
        where: {
          id: Number(id),
        },
        data: {
          name: name,
          price: Number(price),
          sellprice: Number(sellprice),
          lifetime: Number(lifetime),
          categoryId: Number(categoryId),
        },
      });
      return res.status(201).json({
        message: "Product update successfully!",
        user: updateProduct,
      });
    }
    const checkImg = await prisma.products.findFirst({
      where: {
        id: Number(id),
      },
    });
    if (checkImg.image) {
      const oldImagePath = path.join(
        __dirname,
        "../public/product_img",
        checkImg.image
      );
      try {
        fs.unlinkSync(oldImagePath); // Synchronously delete the old image
        console.log("Old image deleted successfully.");
      } catch (err) {
        console.error("Error deleting old image:", err.message);
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
        categoryId: Number(categoryId),
        image: req.file.filename,
      },
    });
    res.status(201).json({
      message: "Product update successfully!",
      user: updateProduct,
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
      const oldImagePath = path.join(
        __dirname,
        "../public/product_img",
        checkImg.image
      );
      try {
        fs.unlinkSync(oldImagePath); // Synchronously delete the old image
        console.log("Old image deleted successfully.");
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
