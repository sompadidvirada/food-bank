const prisma = require("../config/prisma");

exports.createBranch = async (req, res) => {
  try {
    const { branchName, province, latitude, longitude } = req.body;

    // Basic Validation
    if (
      !branchName ||
      !province ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res
        .status(400)
        .json({ message: `Can't create with empty value.` });
    }

    // Type and Range Validation
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return res
        .status(400)
        .json({ message: `Latitude and Longitude must be numbers.` });
    }

    if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res
        .status(400)
        .json({ message: `Invalid latitude or longitude range.` });
    }

    const createB = await prisma.branch.create({
      data: {
        branchname: branchName,
        province: province,
        latitude: latitude,
        longitude: longitude,
      },
    });

    const getProduct = await prisma.products.findMany();

    //PREPARE DATA FOR INSERT
    const dataToInsert = getProduct.map((item) => ({
      productsId: item.id,
      branchId: createB.id,
      aviableStatus: true,
    }));

    // CREATE AVIABLE STATUS FOR THE BRANCH

    await prisma.availableproduct.createMany({
      data: dataToInsert,
      skipDuplicates: true,
    });

    res.status(201).json(createB);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `Server error.` });
  }
};

exports.getBranchs = async (req, res) => {
  try {
    const getAllBranch = await prisma.branch.findMany();
    res.send(getAllBranch);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error` });
  }
};

exports.updateBranchLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { latitude, longitude } = req.body;
    if (!latitude || !longitude || !id) {
      return res.status(400).json({ message: `Cant update with emty value.` });
    }

    const updateLocation = await prisma.branch.update({
      where: {
        id: Number(id),
      },
      data: {
        latitude,
        longitude,
      },
    });
    res.status(200).json(updateLocation);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: `server error` });
  }
};

exports.updateBranchProvice = async (req, res) => {
  try {
    const { branchId, provice } = req.body;

    if (!branchId || !provice) {
      return res.status(400).json({ message: `Emty value.` });
    }

    const updateBranch = await prisma.branch.update({
      where: {
        id: Number(branchId),
      },
      data: {
        province: provice,
      },
    });
    res.send(updateBranch);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error` });
  }
};

exports.cleanAviable = async (req, res) => {
  try {
    const getBranches = await prisma.branch.findMany();
    const getProducts = await prisma.products.findMany();

    // PREPARE DATA FOR INSERT
    const dataToInsert = [];

    getBranches.forEach((branch) => {
      getProducts.forEach((product) => {
        dataToInsert.push({
          productsId: product.id,
          branchId: branch.id,
          aviableStatus: true,
        });
      });
    });

    // BULK INSERT INTO availableproduct
    await prisma.availableproduct.createMany({
      data: dataToInsert,
      skipDuplicates: true, // Skip if (productId, branchId) already exists
    });
    res.send("Done!!!");
  } catch (err) {
    return res.status(500).json({ message: `server error` });
  }
};

exports.changePhonenumber = async (req, res) => {
  try {
    const { phonenumber, branchId } = req.body;

    if (!phonenumber || !branchId) {
      return res.status(400).json({ message: `emty value` });
    }
    const ress = await prisma.branch.update({
      where: {
        id: Number(branchId),
      },
      data: {
        phonenumber: phonenumber,
      },
    });
    res.send(ress);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};
