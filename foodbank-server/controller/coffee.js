const { parseISO, format } = require("date-fns");
const { utcToZonedTime } = require("date-fns-tz");
const prisma = require("../config/prisma");
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

exports.createCoffeeMenu = async (req, res) => {
  try {
    const { name, description, image, size } = req.body;

    if (!name) {
      return res.status(400).json({ message: `emty value.` });
    }
    const ress = await prisma.coffeeMenu.create({
      data: {
        name,
        description,
        size,
        image,
      },
    });
    res.send(ress);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

exports.getAllCoffeeMenu = async (req, res) => {
  try {
    const ress = await prisma.coffeeMenu.findMany();
    res.send(ress);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error` });
  }
};

exports.updateCoffeeMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, contentType, size } = req.body;

    let imageUploadUrl = null;

    const exitingRawMaterial = await prisma.coffeeMenu.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!exitingRawMaterial) {
      return res.status(404).json({ message: `this rawMaterial did't exit.` });
    }

    if (image) {
      if (exitingRawMaterial.image) {
        try {
          const params = {
            Bucket: process.env.SECREY_AWS_BUCKET_IMAGE_COFFEEMENU,
            Key: exitingRawMaterial.image,
          };

          const command = new DeleteObjectCommand(params);
          await s3.send(command);

          console.log("Deleted old image:", exitingUser.image);
        } catch (err) {
          console.error("Error deleting old image:", err.message);
        }
      }

      const command = new PutObjectCommand({
        Bucket: process.env.SECREY_AWS_BUCKET_IMAGE_COFFEEMENU,
        Key: image,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      });

      imageUploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
      if (!imageUploadUrl) {
        return res.status(500).json({ message: `Something went wrong.` });
      }
    }

    const updates = await prisma.coffeeMenu.update({
      where: {
        id: Number(id),
      },
      data: {
        name: name,
        description: description,
        size: size,
        ...(image ? { image } : {}),
      },
    });
    res.status(201).json({
      message: "coffee menu update successfully!",
      rawMaterial: updates,
      imageUploadUrl,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

exports.deleteCoffeeMenu = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.params);
    if (!id) {
      return res.status(400).json({ message: `emty id.` });
    }
    const ress = await prisma.coffeeMenu.delete({
      where: {
        id: Number(id),
      },
    });
    res.send(ress);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

// upload image for coffee menu

exports.getUploadUrl = async (req, res) => {
  try {
    const { image, contentType } = req.body;
    console.log(image, contentType);

    const command = new PutObjectCommand({
      Bucket: process.env.SECREY_AWS_BUCKET_IMAGE_COFFEEMENU,
      Key: image,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 300 });

    return res.json({ uploadUrl: url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create upload URL" });
  }
};

// coffee menu ingredient

exports.createCoffeeMenuIngredient = async (req, res) => {
  try {
    const { quantity, unit, coffeeMenuId, materialVariantId } = req.body;
    console.log(req.body);

    if (!quantity || !unit || !coffeeMenuId || !materialVariantId) {
      return res.status(400).json({ message: `emty value.` });
    }
    const ress = await prisma.coffeeRecipeIngredient.create({
      data: {
        quantity: Number(quantity),
        unit,
        coffeeMenuId: Number(coffeeMenuId),
        materialVariantId: Number(materialVariantId),
      },
    });
    res.send(ress);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

exports.getCoffeeMenuIngredientByCoffeeMenu = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "empty id." });
    }

    const ingredients = await prisma.coffeeRecipeIngredient.findMany({
      where: {
        coffeeMenuId: Number(id),
      },
      include: {
        materialVariant: {
          include: {
            rawMaterial: true,
          },
        },
      },
    });

    // flatten the data
    const result = ingredients.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      image: item.materialVariant.rawMaterial.image,
      unit: item.unit,
      coffeeMenuId: item.coffeeMenuId,
      materialVariantId: item.materialVariant.id,
      materialVariantName: item.materialVariant.variantName,
      rawMaterialId: item.materialVariant.rawMaterial.id,
      rawMaterialName: item.materialVariant.rawMaterial.name,
      sizeUnit: item.materialVariant.rawMaterial.sizeUnit,
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "server error." });
  }
};

exports.updateCoffeeMenuIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    console.log(id, quantity);
    if (!id || !quantity) {
      return res.status(400).json({ message: `emty id.` });
    }
    const ress = await prisma.coffeeRecipeIngredient.update({
      where: {
        id: Number(id),
      },
      data: {
        quantity: Number(quantity),
      },
    });
    res.send(ress);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

exports.deleteCoffeeMenuIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: `emty id.` });
    }
    const ress = await prisma.coffeeRecipeIngredient.delete({
      where: {
        id: Number(id),
      },
    });
    res.send(ress);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

exports.getMaterialVariantChildOnly = async (req, res) => {
  try {
    const ress = await prisma.rawMaterial.findMany({
      include: {
        materialVariant: true,
      },
    });

    // pick only the deepest child
    const result = ress.map((material) => {
      // find variant that is not parent of any other
      const childIds = material.materialVariant.map((v) => v.parentVariantId);
      const lastChild = material.materialVariant.find(
        (v) => !childIds.includes(v.id)
      );

      return {
        id: material.id,
        name: material.name,
        image: material.image,
        sizeUnit: material.sizeUnit,
        description: material.description,
        isActive: material.isActive,
        createAt: material.createAt,
        categoryMeterailId: material.categoryMeterailId,
        materialVariantLastChildId: lastChild?.id,
        variantName: lastChild?.variantName,
        barcode: lastChild?.barcode,
      };
    });

    res.send(result);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

// coffee sell

exports.createCoffeeSell = async (req, res) => {
  try {
    const { sellCount, sellDate, coffeeMenuId, brachId } = req.body;

    if (!sellCount || !sellDate || !coffeeMenuId || !brachId) {
      return res.status(400).json({ message: `emty value.` });
    }
    const formattedsellAt = parseISO(sellDate); // already in UTC

    const ress = await prisma.coffeeSell.create({
      data: {
        sellCount: Number(sellCount),
        sellDate: formattedsellAt,
        coffeeMenuId: Number(coffeeMenuId),
        branchId: Number(brachId),
      },
    });
    res.send(ress);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

exports.checkCoffeeSell = async (req, res) => {
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

    const ress = await prisma.coffeeSell.findMany({
      where: {
        sellDate: {
          gte: startofDay,
          lt: endofDay,
        },
      },
    });
    res.send(ress);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: `server error.` });
  }
};

exports.updateCoffeeSell = async (req, res) => {
  try {
    const { id } = req.params;
    const { sellCount } = req.body;

    console.log(id, sellCount);

    if (!id || !sellCount) {
      return res.status(400).json({ message: `emty value.` });
    }
    const ress = await prisma.coffeeSell.update({
      where: {
        id: Number(id),
      },
      data: {
        sellCount: Number(sellCount),
      },
    });
    res.send(ress);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: `server error.` });
  }
};

exports.deleteAllTheCoffeeSellByDate = async (req, res) => {
  try {
    const { sellDate, brachId } = req.body;
    if (!sellDate || !brachId) {
      return res.status(400).json({ message: `Missing Data.` });
    }
    const dateToDelete = new Date(sellDate);
    const startOfDay = new Date(sellDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(sellDate);
    endOfDay.setHours(23, 59, 59, 999);

    await prisma.coffeeSell.deleteMany({
      where: {
        sellDate: {
          gte: startOfDay,
          lt: endOfDay,
        },
        branchId: Number(brachId),
      },
    });
    res.send("delete success.");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

function calculateLeafUsage(stock, rawMaterials) {
  // Flatten all variants into one array
  const allVariants = rawMaterials.flatMap((r) => r.materialVariant);

  // Helper: follow down to all deepest children
  function getLeavesWithFactor(variantId, allVariants, factor = 1) {
    const variant = allVariants.find((v) => v.id === variantId);
    if (!variant) return [];

    const children = allVariants.filter((v) => v.parentVariantId === variantId);

    if (children.length === 0) {
      // leaf node
      return [{ variant, factor }];
    }

    let results = [];
    for (const child of children) {
      const childFactor = factor * (child.quantityInParent || 1);
      results = results.concat(
        getLeavesWithFactor(child.id, allVariants, childFactor)
      );
    }
    return results;
  }

  let results = [];

  stock.forEach((item) => {
    const leaves = getLeavesWithFactor(
      item.materialVariantId,
      allVariants,
      item.quantityRequisition
    );

    leaves.forEach(({ variant, factor }) => {
      results.push({
        quantityRequisition: factor,
        materialVariantId: variant.id,
        materialVariantName: variant.variantName,
        rawMaterialName:
          rawMaterials.find((r) => r.id === variant.rawMaterialId)?.name || "",
        rawMaterialId: variant.rawMaterialId,
      });
    });
  });

  return results;
}
const calculateIngredientUsage = (coffeeSell) => {
  const usageMap = {};

  coffeeSell.forEach((sell) => {
    const count = sell.sellCount;

    sell.coffeeMenu.recipeItem.forEach((item) => {
      const variant = item.materialVariant;
      const usedQty = count * item.quantity;

      if (!usageMap[variant.id]) {
        usageMap[variant.id] = {
          materialVariantId: variant.id,
          materialVariantName: variant.variantName,
          rawMaterialName: variant.rawMaterial.name,
          rawMaterialId: variant.rawMaterial.id,
          coffeeSellUsed: 0,
        };
      }

      usageMap[variant.id].coffeeSellUsed += usedQty;
    });
  });

  return Object.values(usageMap);
};
function mergeStockAndIngredient(stock, ingredientUsage) {
  const map = {};

  // 1. Add all stock items
  stock.forEach((s) => {
    map[s.materialVariantId] = {
      rawMaterialName: s.rawMaterialName,
      materialVariantId: s.materialVariantId,
      materialVariantName: s.materialVariantName,
      stockRequisition: s.quantityRequisition || 0,
      ingredientUsage: 0,
    };
  });

  // 2. Add all ingredientUsage items
  ingredientUsage.forEach((i) => {
    if (map[i.materialVariantId]) {
      map[i.materialVariantId].ingredientUsage = i.coffeeSellUsed || 0;
    } else {
      map[i.materialVariantId] = {
        rawMaterialName: i.rawMaterialName,
        materialVariantId: i.materialVariantId,
        materialVariantName: i.materialVariantName,
        stockRequisition: 0,
        ingredientUsage: i.coffeeSellUsed || 0,
      };
    }
  });

  // 3. Convert to array
  return Object.values(map);
}

exports.fetchCoffeeSellWithStockRequisition = async (req, res) => {
  const { branchId, startDate, endDate } = req.body;

  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  try {
    const rawMaterial = await prisma.rawMaterial.findMany({
      include: {
        materialVariant: true,
      },
    });

    // branch filter: if branchId === "all", don't filter
    const branchFilter =
      branchId !== "all" ? { branchId: Number(branchId) } : {};

    const stocks = await prisma.stockRequisition.findMany({
      where: {
        requisitionDate: {
          gte: start,
          lte: end,
        },
        ...branchFilter,
      },
      include: {
        materialVariant: true,
      },
    });
    const coffeeSell = await prisma.coffeeSell.findMany({
      where: {
        sellDate: {
          gte: start,
          lte: end,
        },
        ...branchFilter,
      },
      include: {
        coffeeMenu: {
          include: {
            recipeItem: {
              include: {
                materialVariant: {
                  include: {
                    rawMaterial: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // ✅ call the function
    const ingredientUsage = calculateIngredientUsage(coffeeSell);
    const stockReq = calculateLeafUsage(stocks, rawMaterial);

    const barChartData = mergeStockAndIngredient(stockReq, ingredientUsage);

    res.json(barChartData);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

exports.fetchCoffeeIngredientUseByMaterialId = async (req, res) => {
  try {
    const { startDate, endDate, materialVariantId } = req.body;
    console.log(req.body)
    if (!startDate || !endDate || !materialVariantId) {
      return res.status(400).json({ message: `empty value.` });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const branches = await prisma.branch.findMany();
    const rawMaterials = await prisma.rawMaterial.findMany({
      include: { materialVariant: true },
    });

    let results = [];

    for (const branch of branches) {
      // 1. stock requisitions for this branch
      const stocks = await prisma.stockRequisition.findMany({
        where: {
          requisitionDate: { gte: start, lte: end },
          branchId: branch.id,
        },
        include: { materialVariant: true },
      });

      const stockReq = calculateLeafUsage(stocks, rawMaterials);
      const stockItem = stockReq.find(
        (s) => s.materialVariantId === Number(materialVariantId)
      );

      // 2. coffee sells for this branch
      const coffeeSell = await prisma.coffeeSell.findMany({
        where: {
          sellDate: { gte: start, lte: end },
          branchId: branch.id,
        },
        include: {
          coffeeMenu: {
            include: {
              recipeItem: {
                include: {
                  materialVariant: { include: { rawMaterial: true } },
                },
              },
            },
          },
        },
      });

      const ingredientUsage = calculateIngredientUsage(coffeeSell);
      const usageItem = ingredientUsage.find(
        (u) => u.materialVariantId === Number(materialVariantId)
      );

      // 3. build response row
      results.push({
        rawMaterialName:
          stockItem?.rawMaterialName ||
          usageItem?.rawMaterialName ||
          "", // fallback
        branchName: branch.branchname,
        branchId: branch.id,
        materialVariantId: Number(materialVariantId),
        materialVariantName:
          stockItem?.materialVariantName || usageItem?.materialVariantName || "",
        stockRequisition: stockItem?.quantityRequisition || 0,
        ingredientUsage: usageItem?.coffeeSellUsed || 0,
      });
    }

    return res.json(results);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};


 