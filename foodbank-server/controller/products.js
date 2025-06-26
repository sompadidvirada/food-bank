const prisma = require("../config/prisma");

exports.createProduct = async (req, res) => {
  try {
    const { name, price, sellprice, lifetime, categoryId } = req.body;
    if (!name || !price || !sellprice || !lifetime || !categoryId) {
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
          categoryId: Number(categoryId),
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
