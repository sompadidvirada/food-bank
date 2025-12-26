const prisma = require("../config/prisma");

exports.createStockRemain = async (req, res) => {
  try {
    const { materialVariantId, count } = req.body;

    if (!materialVariantId || !count) {
      return res.status(400).json({ message: `emty value.` });
    }

    const ress = await prisma.stock_remain.create({
      data: {
        count: Number(count),
        materialVariantId: Number(materialVariantId),
      },
    });

    res.status(200).json({ message: ress });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ data: `server error.` });
  }
};

exports.getStockRemainAllItem = async (req, res) => {
  try {
    const rawMaterials = await prisma.rawMaterial.findMany({
      include: {
        categoryMeterail: true,
        materialVariant: {
          include: {
            stockRemain: true,
          },
        },
      },
    });

    if (!rawMaterials.length) return res.json([]);

    const results = [];

    for (const rawMaterial of rawMaterials) {
      const variants = rawMaterial.materialVariant || [];
      if (!variants.length) continue;

      const variantMap = {};
      variants.forEach((v) => {
        variantMap[v.id] = {
          ...v,
          childVariants: [],
          stock: v.stockRemain?.count || 0,
          calculatedStock: 0,
        };
      });

      variants.forEach((v) => {
        if (v.parentVariantId) {
          variantMap[v.parentVariantId]?.childVariants.push(variantMap[v.id]);
        }
      });

      const rootVariants = Object.values(variantMap).filter(
        (v) => !v.parentVariantId
      );

      // 1️⃣ Bottom-up: calculate root stocks from children
      const bottomUp = (variant) => {
        let total = variant.stock;
        for (const child of variant.childVariants) {
          const childTotal = bottomUp(child);
          if (child.quantityInParent != null) {
            total += childTotal / child.quantityInParent;
          } else {
            total += childTotal;
          }
        }
        variant.calculatedStock = total;
        return total;
      };
      rootVariants.forEach((root) => bottomUp(root));

      // 2️⃣ Top-down: propagate stock to children
      const topDown = (variant) => {
        for (const child of variant.childVariants) {
          if (child.quantityInParent != null) {
            child.calculatedStock =
              variant.calculatedStock * child.quantityInParent;
          } else if (child.calculatedStock === 0) {
            child.calculatedStock = child.stock;
          }
          topDown(child);
        }
      };
      rootVariants.forEach((root) => topDown(root));

      const stockRemain = variants.map((v) => ({
        id: v.id,
        variantName: v.variantName,
        barcode: v.barcode || "",
        quantityInParent: v.quantityInParent,
        parentVariantId: v.parentVariantId,
        rawStock: v.stockRemain?.count || 0,
        calculatedStock: Number(variantMap[v.id].calculatedStock.toFixed(4)),
      }));

      results.push({
        id: rawMaterial.id,
        rawMaterial: rawMaterial.name,
        description: rawMaterial.description || "",
        categoryMeterail: rawMaterial.categoryMeterail?.name || "",
        categoryMeterailId: rawMaterial.categoryMeterailId,
        sizeUnit: rawMaterial.sizeUnit || "",
        image: rawMaterial.image || "",
        stockRemain,
      });
    }

    return res.json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
};

exports.deleteAllStockRemain = async (req, res) => {
  try {
    await prisma.stock_remain.deleteMany();

    res.status(200).json({ message: `Delete success.` });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error` });
  }
};

exports.updateStockRemain = async (req, res) => {

  try {
    const { id } = req.params;
    const { editCount, materialVariantId } = req.body;

    if (!id || !editCount || !materialVariantId) {
      return res.status(400).json({ message: `emty value to update.` });
    }

   // Delete all stock_remain records where the variant belongs to the rawMaterial
    const deleteResult = await prisma.stock_remain.deleteMany({
      where: {
        materialVariant: {
          rawMaterialId: Number(id)
        }
      }
    });

    const createNewStockRemain = await prisma.stock_remain.create({
      data: {
        materialVariantId: Number(materialVariantId),
        count: Number(editCount)
      }
    })

    res.status(200).json({ message: `update success.` });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `error update stockremain.` });
  }
};
