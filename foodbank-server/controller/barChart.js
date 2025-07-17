const prisma = require("../config/prisma");

const generateColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

exports.getBarChartSell = async (req, res) => {
  try {
    const { startDate, endDate, branchs } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const sellData = await prisma.tracksell.findMany({
      where: {
        sellAt: {
          gte: start,
          lte: end,
        },
        branchId: { notIn: branchs },
      },
      include: {
        branch: true,
        products: true,
      },
    });

    const transformData = {};

    sellData.forEach(({ branch, products, sellCount }) => {
      const branchName = branch.branchname;
      const productName = products.name;

      if (!transformData[branchName]) {
        transformData[branchName] = { country: branchName };
      }
      
      if (!transformData[branchName][productName]) {
        transformData[branchName][productName] = 0;
      }
      transformData[branchName][productName] += sellCount;

      if (!transformData[branchName][`${productName}Color`]) {
        transformData[branchName][`${productName}Color`] =
          generateColor(productName);
      }
    });

    res.json(Object.values(transformData));
  } catch (err) {
    return res.status(err).json({ message: `server error.` });
  }
};
exports.getBarChartSend = async (req, res) => {
  try {
    const { startDate, endDate, branchs } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const sellData = await prisma.tracksend.findMany({
      where: {
        sendAt: {
          gte: start,
          lte: end,
        },
        branchId: { notIn: branchs },
      },
      include: {
        branch: true,
        products: true,
      },
    });

    const transformData = {};

    sellData.forEach(({ branch, products, sendCount }) => {
      const branchName = branch.branchname;
      const productName = products.name;

      if (!transformData[branchName]) {
        transformData[branchName] = { country: branchName };
      }

      if (!transformData[branchName][productName]) {
        transformData[branchName][productName] = 0;
      }
      transformData[branchName][productName] += sendCount;

      if (!transformData[branchName][`${productName}Color`]) {
        transformData[branchName][`${productName}Color`] =
          generateColor(productName);
      }
    });

    res.json(Object.values(transformData));
  } catch (err) {
    return res.status(err).json({ message: `server error.` });
  }
};
exports.getBarChartExp = async (req, res) => {
  try {
    const { startDate, endDate, branchs } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const sellData = await prisma.trackexp.findMany({
      where: {
        expAt: {
          gte: start,
          lte: end,
        },
        branchId: { notIn: branchs },
      },
      include: {
        branch: true,
        products: true,
      },
    });

    const transformData = {};

    sellData.forEach(({ branch, products, expCount }) => {
      const branchName = branch.branchname;
      const productName = products.name;

      if (!transformData[branchName]) {
        transformData[branchName] = { country: branchName };
      }

      if (!transformData[branchName][productName]) {
        transformData[branchName][productName] = 0;
      }
      transformData[branchName][productName] += expCount;

      if (!transformData[branchName][`${productName}Color`]) {
        transformData[branchName][`${productName}Color`] =
          generateColor(productName);
      }
    });

    res.json(Object.values(transformData));
  } catch (err) {
    return res.status(err).json({ message: `server error.` });
  }
};
