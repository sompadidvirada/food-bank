const prisma = require("../config/prisma");

exports.reportPerBranch = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // Fetch all products with their available products (for all branches)
    const fecthProducts = await prisma.products.findMany({
      include: {
        available: true,
      },
    });

    // Fetch all branches with tracking info within the date range
    const fecthBrach = await prisma.branch.findMany({
      include: {
        tracksell: {
          where: {
            sellAt: {
              gte: start,
              lte: end,
            },
          },
        },
        tracksend: {
          where: {
            sendAt: {
              gte: start,
              lte: end,
            },
          },
        },
        trackexp: {
          where: {
            expAt: {
              gte: start,
              lte: end,
            },
          },
        },
      },
    });

    // Generate result per branch
    const result = fecthBrach.map((brach) => {
      const detail = fecthProducts.map((product) => {
        const totalSell = brach.tracksell
          .filter((s) => s.productsId === product.id)
          .reduce((sum, s) => sum + s.sellCount, 0);

        const totalSend = brach.tracksend
          .filter((s) => s.productsId === product.id)
          .reduce((sum, s) => sum + s.sendCount, 0);

        const totalExp = brach.trackexp
          .filter((s) => s.productsId === product.id)
          .reduce((sum, s) => sum + s.expCount, 0);

        // Find avilableproduct specific to this product and this branch
        const availableProduct = product.available.find(
          (ap) => ap.branchId === brach.id
        );

        return {
          id: product.id,
          name: product.name,
          price: product.price,
          sellPrice: product.sellprice,
          image: product.image,
          totalSell,
          totalSend,
          totalExp,
          totalPriceSend: product.price * totalSend,
          totalPriceSell: product.sellprice * totalSell,
          totalPriceExp: product.price * totalExp,
          availableProductCount: availableProduct?.aviableStatus
            ? availableProduct.count
            : 0, // Optional chaining in case it's undefined
        };
      });

      return {
        id: brach.id,
        name: brach.branchname,
        detail,
      };
    });

    res.send(result);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error.` });
  }
};

exports.TotalData = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const fecthProducts = await prisma.products.findMany();

    const fecthBrach = await prisma.branch.findMany({
      include: {
        tracksell: {
          where: {
            sellAt: {
              gte: start,
              lte: end,
            },
          },
        },
        tracksend: {
          where: {
            sendAt: {
              gte: start,
              lte: end,
            },
          },
        },
        trackexp: {
          where: {
            expAt: {
              gte: start,
              lte: end,
            },
          },
        },
      },
    });

    // 🧠 Aggregate by product across all branches
    const totalDetail = fecthProducts.map((product) => {
      let totalSell = 0;
      let totalSend = 0;
      let totalExp = 0;

      fecthBrach.forEach((branch) => {
        totalSell += branch.tracksell
          .filter((s) => s.productsId === product.id)
          .reduce((sum, s) => sum + s.sellCount, 0);

        totalSend += branch.tracksend
          .filter((s) => s.productsId === product.id)
          .reduce((sum, s) => sum + s.sendCount, 0);

        totalExp += branch.trackexp
          .filter((s) => s.productsId === product.id)
          .reduce((sum, s) => sum + s.expCount, 0);
      });

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        sellPrice: product.sellprice,
        image: product.image,
        totalSell,
        totalSend,
        totalExp,
        totalPriceSend: product.price * totalSend,
        totalPriceSell: product.sellprice * totalSell,
        totalPriceEXP: product.price * totalExp,
      };
    });

    res.send({ totalDetail });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `Something went wrong 500.` });
  }
};
