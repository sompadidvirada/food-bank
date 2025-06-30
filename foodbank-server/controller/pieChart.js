const prisma = require("../config/prisma");

const generateUniqueColors = (count) => {
  const colors = [];
  const step = 360 / count; // Evenly distribute colors around the HSL wheel
  for (let i = 0; i < count; i++) {
    const hue = Math.floor(i * step); // Spread hues evenly
    colors.push(`hsl(${hue}, 70%, 50%)`);
  }
  return colors;
};

exports.pieChartSell = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const ress = await prisma.tracksell.findMany({
      where: { sellAt: { gte: start, lte: end } },
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
    const { startDate, endDate } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const ress = await prisma.tracksend.findMany({
      where: { sendAt: { gte: start, lte: end } },
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
    const { startDate, endDate } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const ress = await prisma.trackexp.findMany({
      where: { expAt: { gte: start, lte: end } },
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
