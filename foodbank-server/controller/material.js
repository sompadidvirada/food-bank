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

// CATEGORY MATERIAL

exports.deleteStockRequisition = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: `emty id.` });
    }
    const ress = await prisma.stockRequisition.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json({ message: `delete success.`, data: ress });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

exports.createCategoryMaterial = async (req, res) => {
  try {
    const { categoryMaterialName } = req.body;
    if (!categoryMaterialName) {
      return res.status(400).json({ message: `emty value.` });
    }
    const create = await prisma.categoryMeterail.create({
      data: {
        name: categoryMaterialName,
      },
    });
    res.send(create);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};
exports.getCategoryMaterial = async (req, res) => {
  try {
    const ress = await prisma.categoryMeterail.findMany();
    res.send(ress);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};
exports.updateCategoryMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryMaterialName } = req.body;
    if (!categoryMaterialName || !id) {
      return res.status(400).json({ message: `emty value.` });
    }
    const update = await prisma.categoryMeterail.update({
      where: {
        id: Number(id),
      },
      data: {
        name: categoryMaterialName,
      },
    });
    res.send(update);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};
exports.deleteCategoryMaterial = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: `empty value.` });
    }
    const remove = await prisma.categoryMeterail.deleteMany({
      where: {
        id: { in: ids.map(Number) },
      },
    });

    res.send(remove); // returns { count: X }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `serever error.` });
  }
};

// RAW MATERIAL

exports.createRawMaterial = async (req, res) => {
  try {
    const {
      rawMaterial,
      description,
      categoryMeterailId,
      variantName,
      sizeUnit,
      costPriceKip,
      sellPriceKip,
      costPriceBath,
      sellPriceBath,
      barcode,
      image,
    } = req.body;

    const material = await prisma.rawMaterial.create({
      data: {
        name: rawMaterial,
        description,
        image,
        sizeUnit: sizeUnit,
        categoryMeterailId: Number(categoryMeterailId),
      },
    });

    await prisma.materialVariant.create({
      data: {
        rawMaterialId: Number(material.id),
        variantName,
        costPriceKip: Number(costPriceKip),
        sellPriceKip: Number(sellPriceKip),
        costPriceBath: Number(costPriceBath),
        sellPriceBath: Number(sellPriceBath),
        barcode,
      },
    });

    return res.json({ message: "Created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getUploadUrl = async (req, res) => {
  try {
    const { image, contentType } = req.body;
    console.log(image, contentType);

    const command = new PutObjectCommand({
      Bucket: process.env.SECREY_AWS_BUCKET_IMAGE_RAWMATERIAL,
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

exports.updateRawMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      categoryMeterailId,
      sizeUnit,
      minOrder,
      image,
      contentType,
    } = req.body;

    if (!name || !categoryMeterailId) {
      return res.status(400).json({ message: `emty value.` });
    }

    let imageUploadUrl = null;

    const exitingRawMaterial = await prisma.rawMaterial.findUnique({
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
            Bucket: process.env.SECREY_AWS_BUCKET_IMAGE_RAWMATERIAL,
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
        Bucket: process.env.SECREY_AWS_BUCKET_IMAGE_RAWMATERIAL,
        Key: image,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      });

      imageUploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
      if (!imageUploadUrl) {
        return res.status(500).json({ message: `Something went wrong.` });
      }
    }

    const updates = await prisma.rawMaterial.update({
      where: {
        id: Number(id),
      },
      data: {
        name: name,
        description: description,
        sizeUnit: sizeUnit,
        categoryMeterailId: Number(categoryMeterailId),
        minOrder: Number(minOrder),
        ...(image ? { image } : {}),
      },
    });
    res.status(201).json({
      message: "Product update successfully!",
      rawMaterial: updates,
      imageUploadUrl,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

exports.getRawMaterial = async (req, res) => {
  try {
    const ress = await prisma.rawMaterial.findMany({
      include: {
        materialVariant: true,
        categoryMeterail: true,
      },
    });

    // Transform response: pick only parent variant
    const formatted = ress.map((item) => {
      const parentVariant = item.materialVariant.find(
        (v) => v.parentVariantId === null,
      );

      return {
        id: item.id,
        name: item.name,
        image: item.image,
        description: item.description,
        isActive: item.isActive,
        createAt: item.createAt,
        minOrder: item.minOrder,
        sizeUnit: item.sizeUnit,
        categoryMeterailId: item.categoryMeterailId,
        categoryMeterail: item.categoryMeterail.name,
        materialVariantName: parentVariant?.variantName || null,
        costPriceKip: parentVariant?.costPriceKip || null,
        sellPriceKip: parentVariant?.sellPriceKip || null,
        costPriceBath: parentVariant?.costPriceBath || null,
        sellPriceBath: parentVariant?.sellPriceBath || null,
        barcode: parentVariant?.barcode || null,
      };
    });

    res.send(formatted);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

exports.deleteRawMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(500).json({ message: `emty id.` });
    }

    const checkRawMaterial = await prisma.rawMaterial.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!checkRawMaterial) {
      return res.status(404).json({ message: `this rawmaterial is not exit.` });
    }
    if (checkRawMaterial.image) {
      try {
        const params = {
          Bucket: process.env.SECREY_AWS_BUCKET_IMAGE_RAWMATERIAL,
          Key: checkRawMaterial.image,
        };

        const command = new DeleteObjectCommand(params);
        await s3.send(command);

        console.log("Deleted old image:", checkRawMaterial.image);
      } catch (err) {
        console.error("Error deleting old image:", err.message);
      }
    }

    await prisma.rawMaterial.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(202).json({ message: `Delete item success.` });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

// RAW MATERIAL VARIANT

exports.createRawmaterialVariant = async (req, res) => {
  try {
    const {
      rawMaterialId,
      variantName,
      quantityInParent,
      parentVariantId,
      costPriceKip,
      sellPriceKip,
      costPriceBath,
      sellPriceBath,
      barcode,
    } = req.body;

    if (
      !rawMaterialId ||
      !variantName ||
      !quantityInParent ||
      !parentVariantId ||
      !barcode
    ) {
      return res.status(400).json({ message: `emty value.` });
    }

    const ress = await prisma.materialVariant.create({
      data: {
        rawMaterialId: Number(rawMaterialId),
        variantName,
        quantityInParent: Number(quantityInParent),
        parentVariantId: Number(parentVariantId),
        costPriceKip: Number(costPriceKip),
        sellPriceKip: Number(sellPriceKip),
        costPriceBath: Number(costPriceBath),
        sellPriceBath: Number(sellPriceBath),
        barcode,
      },
    });
    res.send(ress);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

exports.getMaterialVariantFromId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: `empty id.` });
    }

    let ress = await prisma.materialVariant.findMany({
      where: {
        rawMaterialId: Number(id),
      },
    });

    // ✅ Sort so parent (parentVariantId === null) always comes first
    ress.sort((a, b) => {
      if (a.parentVariantId === null && b.parentVariantId !== null) return -1;
      if (a.parentVariantId !== null && b.parentVariantId === null) return 1;
      return 0; // keep original order for siblings
    });

    res.send(ress);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

exports.deleteMaterialVariant = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: `No id.` });
    }

    const check = await prisma.materialVariant.findFirst({
      where: {
        id: Number(id),
      },
    });
    if (check.parentVariantId === null) {
      return req.status(500).json({ message: `Can't delete this material.` });
    }
    const ress = await prisma.materialVariant.delete({
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

function buildUpdateData(newPrices) {
  const data = {};
  if (newPrices.costPriceKip != null)
    data.costPriceKip = Number(newPrices.costPriceKip);
  if (newPrices.sellPriceKip != null)
    data.sellPriceKip = Number(newPrices.sellPriceKip);
  if (newPrices.costPriceBath != null)
    data.costPriceBath = Number(newPrices.costPriceBath);
  if (newPrices.sellPriceBath != null)
    data.sellPriceBath = Number(newPrices.sellPriceBath);
  if (newPrices.variantName != "") data.variantName = newPrices.variantName;
  if (newPrices.barcode != "") data.barcode = newPrices.barcode;

  return data;
}

exports.updateMaterialVariant = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      costPriceKip,
      costPriceBath,
      sellPriceBath,
      sellPriceKip,
      variantName,
      barcode,
    } = req.body;
    if (!id) {
      return res.status(400).json({ message: `No id.` });
    }

    // Build newPrices object from request body
    const newPrices = {
      costPriceKip,
      costPriceBath,
      sellPriceBath,
      sellPriceKip,
      variantName,
      barcode,
    };

    // 1. Update the root only with non-null values
    const root = await prisma.materialVariant.update({
      where: { id: Number(id) }, // make sure id is a number
      data: buildUpdateData(newPrices),
    });

    // 2. Recursively update children
    async function updateChildren(parent) {
      const children = await prisma.materialVariant.findMany({
        where: { parentVariantId: parent.id },
      });

      for (const child of children) {
        const qty = child.quantityInParent || 1;

        // Build child prices only if parent has them
        const childData = {};
        if (parent.costPriceKip != null)
          childData.costPriceKip = parent.costPriceKip / qty;
        if (parent.sellPriceKip != null)
          childData.sellPriceKip = parent.sellPriceKip / qty;
        if (parent.costPriceBath != null)
          childData.costPriceBath = parent.costPriceBath / qty;
        if (parent.sellPriceBath != null)
          childData.sellPriceBath = parent.sellPriceBath / qty;

        const updatedChild = await prisma.materialVariant.update({
          where: { id: child.id },
          data: childData,
        });

        // recurse deeper
        await updateChildren(updatedChild);
      }
    }

    await updateChildren(root);

    return res.json(root); // return response to client
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

// with stock requition

exports.getMaterialVariant = async (req, res) => {
  try {
    const { startDate, endDate, rawMaterialId, branchId } = req.body;

    const formattedsellAt = parseISO(requisitionDate); // already in UTC
    const start = new Date(formattedsellAt);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(formattedsellAt);
    end.setUTCHours(23, 59, 59, 999);

    // fetch variants with requisitions
    const variants = await prisma.materialVariant.findMany({
      where: {
        rawMaterialId: Number(rawMaterialId),
      },
      include: {
        rawMaterial: true, // include raw material name
        stockRequisition: {
          where: {
            requisitionDate: {
              gte: start,
              lte: end,
            },
            branchId: Number(branchId),
          },
          include: {
            branch: true,
          },
        },
      },
    });

    // transform result
    const normalized = variants.flatMap((variant) =>
      variant.stockRequisition.map((req) => {
        return {
          requisitionId: req.id,
          rawMaterial: variant.rawMaterial.name,
          variant: variant.variantName, // e.g. "1kg", "g"
          baseUnitQty: `${req.quantityRequisition * variant.sizeValue}${
            variant.sizeUnit
          }`,
          costPriceKip: req.quantityRequisition * req.unitPriceKip,
          costSellPriceKip: req.quantityRequisition * req.unitSellPriceKip,
          costPriceBath: req.quantityRequisition * req.unitPriceBath,
          costSellPriceBath: req.quantityRequisition * req.unitSellPriceBath,
          requisitionDate: req.requisitionDate,
          branchId: req.branchId,
          branch: req.branch.branchname,
        };
      }),
    );

    res.json(normalized);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "server error." });
  }
};

//

exports.insertStockRequition = async (req, res) => {
  try {
    const {
      materialVariantId,
      quantityRequisition,
      unitPriceKip,
      unitSellPriceKip,
      totalPriceKip,
      unitPriceBath,
      unitSellPriceBath,
      totalPriceBath,
      requisitionDate,
      branchId,
    } = req.body;

    console.log(req.body);

    const formattedsellAt = parseISO(requisitionDate); // already in UTC
    const start = new Date(formattedsellAt);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(formattedsellAt);
    end.setUTCHours(23, 59, 59, 999);

    const ress = await prisma.stockRequisition.create({
      data: {
        materialVariantId: Number(materialVariantId),
        quantityRequisition: Number(quantityRequisition),
        unitPriceKip: unitPriceKip ?? 0,
        unitSellPriceKip: unitSellPriceKip ?? 0,
        totalPriceKip: totalPriceKip ?? 0,
        unitPriceBath: unitPriceBath ?? 0,
        unitSellPriceBath: unitSellPriceBath ?? 0,
        totalPriceBath: totalPriceBath ?? 0,
        requisitionDate: formattedsellAt,
        branchId: Number(branchId),
      },
    });
    res.send(ress);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

////query the stockrequisition

exports.getStockRequisitionHistory = async (req, res) => {
  try {
    const { startDate, endDate, rawMaterialId, branchId } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // 1. Get all variants
    const variants = await prisma.materialVariant.findMany({
      where: { rawMaterialId },
      include: {
        childVariants: {
          include: {
            childVariants: true,
          },
        },
        parentVariant: true,
        rawMaterial: true,
      },
    });

    if (!variants.length) return res.json([]);

    const variantIds = variants.map((v) => v.id);

    // 2. Get requisitions
    const requisitions = await prisma.stockRequisition.findMany({
      where: {
        materialVariantId: { in: variantIds },
        branchId,
        requisitionDate: { gte: start, lte: end },
      },
    });

    // 3. Build requisition map
    const reqMap = {};
    for (const reqItem of requisitions) {
      if (!reqMap[reqItem.materialVariantId]) {
        reqMap[reqItem.materialVariantId] = 0;
      }
      reqMap[reqItem.materialVariantId] += reqItem.quantityRequisition;
    }

    // 4. Bottom-up: compute total for top-level variant only
    const bottomUp = (variant) => {
      let total = reqMap[variant.id] || 0;
      if (variant.childVariants?.length > 0) {
        for (const child of variant.childVariants) {
          const childTotal = bottomUp(child);
          if (child.quantityInParent) {
            total += childTotal / child.quantityInParent; // Convert child to parent units
          } else {
            total += childTotal;
          }
        }
      }
      return total; // Return total without updating reqMap
    };

    // 5. Top-down: distribute parent → child
    const topDown = (variant, parentQty = 0) => {
      // Use original requisition quantity or 0
      let ownQty = reqMap[variant.id] || 0;
      // If parentQty exists, convert it to child units
      if (parentQty > 0 && variant.quantityInParent) {
        ownQty = parentQty * variant.quantityInParent; // Overwrite with parent’s contribution
      }
      reqMap[variant.id] = ownQty; // Update reqMap

      if (variant.childVariants?.length > 0) {
        for (const child of variant.childVariants) {
          topDown(child, ownQty); // Pass current variant’s quantity to children
        }
      }
    };

    // 6. Run both passes
    for (const v of variants) {
      if (!v.parentVariant) {
        const total = bottomUp(v); // Compute top-level total
        reqMap[v.id] = total; // Update top-level variant
        topDown(v, total); // Distribute to children
      }
    }

    // 7. Build result
    const rawMaterial = variants[0].rawMaterial;
    const result = {
      rawMaterial: rawMaterial.name,
      description: rawMaterial.description,
      categoryMeterailId: rawMaterial.categoryMeterailId,
      image: rawMaterial.image,
      sizeUnit: rawMaterial.sizeUnit,
      Allstockrequisition: variants.map((v) => ({
        id: v.id,
        variantName: v.variantName,
        costPriceKip: v.costPriceKip,
        sellPriceKip: v.sellPriceKip,
        costPriceBath: v.costPriceBath,
        sellPriceBath: v.sellPriceBath,
        barcode: v.barcode,
        quantityRequition: reqMap[v.id] || 0,
      })),
    };

    return res.json([result]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "server error." });
  }
};

exports.getStockRequisitionAllItem = async (req, res) => {
  try {
    const { startDate, endDate, branchId } = req.body;
    if (!startDate || !endDate || !branchId) {
      return res.status(400).json({ message: "Empty value." });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const rawMaterials = await prisma.rawMaterial.findMany({
      include: {
        materialVariant: true,
      },
    });

    if (!rawMaterials.length) return res.json([]);

    const results = [];

    for (const rawMaterial of rawMaterials) {
      const variants = rawMaterial.materialVariant || [];
      if (!variants.length) continue;

      // 1. Build local variant tree
      const variantMap = {};
      variants.forEach((v) => {
        variantMap[v.id] = { ...v, childVariants: [] };
      });
      variants.forEach((v) => {
        if (v.parentVariantId && variantMap[v.parentVariantId]) {
          variantMap[v.parentVariantId].childVariants.push(variantMap[v.id]);
        }
      });

      const rootVariants = variants
        .filter((v) => !v.parentVariantId)
        .map((v) => variantMap[v.id]);

      // 2. Fetch Requisitions
      const variantIds = variants.map((v) => v.id);
      const requisitions = await prisma.stockRequisition.findMany({
        where: {
          materialVariantId: { in: variantIds },
          ...(branchId !== "all" && { branchId: Number(branchId) }),
          requisitionDate: { gte: start, lte: end },
        },
      });

      // 3. Map actual DB quantities
      const reqMap = {};
      variants.forEach((v) => {
        reqMap[v.id] = 0;
      });

      for (const reqItem of requisitions) {
        reqMap[reqItem.materialVariantId] += reqItem.quantityRequisition;
      }

      // 4. Bottom-up: Gather everything into the Top-Level (e.g., all units to "Boxes")
      const bottomUp = (variant) => {
        let totalQty = reqMap[variant.id] || 0;

        for (const child of variant.childVariants) {
          const childQty = bottomUp(child);
          if (child.quantityInParent > 0) {
            totalQty += childQty / child.quantityInParent;
          }
        }
        reqMap[variant.id] = totalQty;
        return totalQty;
      };

      // 5. Top-down: FORCED distribution (This gives you 580 and 29000)
      const finalMap = {};
      const topDown = (variant, inheritedQty = null) => {
        let currentQty;

        if (inheritedQty === null) {
          // This is the Root (Box) - use the sum of everything from bottomUp
          currentQty = reqMap[variant.id];
        } else {
          // This is a Child (Pack/Cup) - multiply from the parent
          currentQty = inheritedQty * (variant.quantityInParent || 0);
        }

        finalMap[variant.id] = currentQty;

        for (const child of variant.childVariants) {
          topDown(child, currentQty);
        }
      };

      // Run logic
      for (const root of rootVariants) {
        bottomUp(root);
        topDown(root);
      }

      // 6. Build response
      results.push({
        id: rawMaterial.id,
        rawMaterial: rawMaterial.name,
        description: rawMaterial.description || "",
        categoryMeterailId: rawMaterial.categoryMeterailId,
        image: rawMaterial.image || "",
        sizeUnit: rawMaterial.sizeUnit || "",
        Allstockrequisition: variants.map((v) => ({
          id: v.id,
          variantName: v.variantName,
          // Keep actual price totals for that specific variant
          totalPriceKip: requisitions
            .filter((r) => r.materialVariantId === v.id)
            .reduce((sum, r) => sum + (r.totalPriceKip || 0), 0),
          totalPriceBath: requisitions
            .filter((r) => r.materialVariantId === v.id)
            .reduce((sum, r) => sum + (r.totalPriceBath || 0), 0),
          barcode: v.barcode || "",
          quantityRequition: finalMap[v.id] || 0,
        })),
      });
    }

    return res.json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
};

// query for insert stockrequisition....

exports.getRawMaterialVariant = async (req, res) => {
  try {
    const ress = await prisma.rawMaterial.findMany({
      include: {
        materialVariant: true,
        categoryMeterail: true,
      },
    });
    res.send(ress);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

// query stockrequisition

exports.checkStockRequisitionByDate = async (req, res) => {
  try {
    const { requisitionDate, branchId } = req.body;

    if (!requisitionDate || !branchId) {
      return res
        .status(500)
        .json({ message: `Something went wrong. No Data.` });
    }

    const startofDay = new Date(requisitionDate);
    const endofDay = new Date(requisitionDate);
    startofDay.setUTCHours(0, 0, 0, 0);
    endofDay.setUTCHours(23, 59, 59, 999);

    const ress = await prisma.stockRequisition.findMany({
      where: {
        requisitionDate: {
          gte: startofDay,
          lt: endofDay,
        },
        branchId: Number(branchId),
      },
    });
    res.send(ress);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

exports.updateStockRequisition = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantityRequisition } = req.body;

    if (!id || !quantityRequisition) {
      return res.status(404).json({ message: `emty value.` });
    }

    const ress = await prisma.stockRequisition.update({
      where: {
        id: Number(id),
      },
      data: {
        quantityRequisition: Number(quantityRequisition),
      },
    });
    res.send(ress);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

exports.deleteAllStockRequisitionByDate = async (req, res) => {
  try {
    const { requisitionDate, branchId } = req.body;

    if (!requisitionDate || !branchId) {
      return res
        .status(500)
        .json({ message: `Something went wrong. No Data.` });
    }

    const startofDay = new Date(requisitionDate);
    const endofDay = new Date(requisitionDate);
    startofDay.setUTCHours(0, 0, 0, 0);
    endofDay.setUTCHours(23, 59, 59, 999);

    await prisma.stockRequisition.deleteMany({
      where: {
        requisitionDate: {
          gte: startofDay,
          lt: endofDay,
        },
        branchId: Number(branchId),
      },
    });
    res.send(`Delete Success`);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server erorr` });
  }
};

// calculate priceKip and sellPricekip by exchangeRate

exports.updateMaterialVariantByExchangeRate = async (req, res) => {
  try {
    const { exchangeRate } = req.body;

    if (!exchangeRate || isNaN(exchangeRate)) {
      return res.status(400).json({ message: "Invalid exchange rate." });
    }

    // Fetch only materialVariants with costPriceBath not null
    const materialVariants = await prisma.materialVariant.findMany({
      where: {
        costPriceBath: { gt: 0 }, // excludes null and 0
        sellPriceBath: { gt: 0 }, // excludes null and 0
      },
      select: {
        id: true,
        costPriceBath: true,
      },
    });

    // Prepare update promises
    const updates = materialVariants.map((variant) =>
      prisma.materialVariant.update({
        where: { id: variant.id },
        data: {
          costPriceKip: Math.round(variant.costPriceBath * exchangeRate),
          sellPriceKip: Math.round(variant.costPriceBath * exchangeRate),
        },
      }),
    );

    // Execute all updates atomically
    await prisma.$transaction(updates);

    res.json({ message: "Update success." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};
