const prisma = require("../config/prisma");

exports.LineChart = async (req, res) => {
  try {
    const { startDate, endDate, branchs } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // Fetch total sales grouped by branch and sellDay
    const salesData = await prisma.tracksell.groupBy({
      by: ["sellDay", "branchId"],
      where: {
        sellAt: {
          gte: start,
          lte: end,
        },
        branchId: { notIn: branchs },
      },
      _sum: {
        sellCount: true,
      },
    });

    // Fetch branch names
    const branches = await prisma.branch.findMany({
      where: {
        id: { in: salesData.map((sale) => sale.branchId) },
      },
      select: {
        id: true,
        branchname: true,
      },
    });

    // Map for quick branch name lookup
    const branchMap = {};
    branches.forEach((branch) => {
      branchMap[branch.id] = branch.branchname;
    });

    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    // Initialize Recharts format: one object per day
    const chartData = daysOfWeek.map((day) => {
      const entry = { name: day };
      branches.forEach((branch) => {
        entry[branch.branchname] = 0; // default 0
      });
      return entry;
    });

    // Fill in actual sales data
    salesData.forEach(({ sellDay, branchId, _sum }) => {
      const branchName = branchMap[branchId];
      const dayEntry = chartData.find(
        (entry) => entry.name.toLowerCase() === sellDay.toLowerCase()
      );
      if (branchName && dayEntry) {
        dayEntry[branchName] += _sum.sellCount || 0;
      }
    });

    res.json(chartData);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `server error` });
  }
};
