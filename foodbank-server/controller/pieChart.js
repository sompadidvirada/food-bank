const prisma = require("../config/prisma");

const generateUniqueColors = (count) => {
  const colors = [];
  const goldenAngle = 137.508;

  for (let i = 0; i < count; i++) {
    const hue = (i * goldenAngle) % 360;
    const saturation = 60 + (i % 3) * 15; // 60, 75, 90%
    const lightness = 40 + (i % 4) * 12;  // 40, 52, 64, 76%

    colors.push(`hsl(${Math.round(hue)}, ${saturation}%, ${lightness}%)`);
  }

  return colors;
};



exports.pieChartSell = async (req, res) => {
  try {
    const { startDate, endDate, branchs } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const ress = await prisma.tracksell.findMany({
      where: {
        sellAt: { gte: start, lte: end },
        branchId: { notIn: branchs },
      },

      include: { products: true },
    });

    // Group by product name and sum the sellCount
    const groupedData = ress.reduce((acc, curr) => {
      const productName = curr.products.name;
      if (!acc[productName]) {
        acc[productName] = { label: productName, value: 0 };
      }
      acc[productName].value += curr.sellCount;
      return acc;
    }, {});

    // Generate unique colors
    const uniqueColors = generateUniqueColors(Object.keys(groupedData).length);

    // Convert the grouped data into the desired format
    const result = Object.keys(groupedData).map((productName, index) => ({
      id: productName,
      label: productName,
      value: groupedData[productName].value,
      color: uniqueColors[index],
    }));

    res.send(result);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `Something went wrong.` });
  }
};
exports.pieChartSend = async (req, res) => {
  try {
    const { startDate, endDate, branchs } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const ress = await prisma.tracksend.findMany({
      where: {
        sendAt: { gte: start, lte: end },
        branchId: { notIn: branchs },
      },
      include: { products: true },
    });

    // Group by product name and sum the sellCount
    const groupedData = ress.reduce((acc, curr) => {
      const productName = curr.products.name;
      if (!acc[productName]) {
        acc[productName] = { label: productName, value: 0 };
      }
      acc[productName].value += curr.sendCount;
      return acc;
    }, {});

    // Generate unique colors
    const uniqueColors = generateUniqueColors(Object.keys(groupedData).length);

    // Convert the grouped data into the desired format
    const result = Object.keys(groupedData).map((productName, index) => ({
      id: productName,
      label: productName,
      value: groupedData[productName].value,
      color: uniqueColors[index],
    }));

    res.send(result);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `Something went wrong.` });
  }
};
exports.pieChartExp = async (req, res) => {
  try {
    const { startDate, endDate, branchs } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const ress = await prisma.trackexp.findMany({
      where: {
        expAt: { gte: start, lte: end },
        branchId: { notIn: branchs },
      },
      include: { products: true },
    });

    // Group by product name and sum the sellCount
    const groupedData = ress.reduce((acc, curr) => {
      const productName = curr.products.name;
      if (!acc[productName]) {
        acc[productName] = { label: productName, value: 0 };
      }
      acc[productName].value += curr.expCount;
      return acc;
    }, {});

    // Generate unique colors
    const uniqueColors = generateUniqueColors(Object.keys(groupedData).length);

    // Convert the grouped data into the desired format
    const result = Object.keys(groupedData).map((productName, index) => ({
      id: productName,
      label: productName,
      value: groupedData[productName].value,
      color: uniqueColors[index],
    }));

    res.send(result);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `Something went wrong.` });
  }
};
