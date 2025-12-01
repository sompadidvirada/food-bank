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
        status: product.status,
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

exports.reportTreekoffSellDashborad = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const sells = await prisma.coffeeSell.findMany({
      where: {
        sellDate: {
          gte: start,
          lte: end,
        },
      },
      select: {
        sellCount: true,
        coffeeMenu: {
          select: {
            name: true,
            type_2: true,
            type: true,
            size: true,
          },
        },
        branch: true,
      },
    });

    // 1. Calculate Totals
    const typeTotals = {};
    const typeTotalsType = {};
    sells.forEach((sell) => {
      const type = sell.coffeeMenu.type_2 || "UNKNOWN";
      typeTotals[type] = (typeTotals[type] || 0) + sell.sellCount;
    });
    sells.forEach((sell) => {
      const type = sell.coffeeMenu.type || "UNKNOWN";
      typeTotalsType[type] = (typeTotalsType[type] || 0) + sell.sellCount;
    });

    // --- CHANGED SECTION START ---

    // Calculate the numeric sum
    const TOTAL = Object.values(typeTotals).reduce((sum, v) => sum + v, 0);

    // Create a single object containing the types and the TOTAL
    const total_type_2 = {
      ...typeTotals, // Spreads existing keys (e.g., Hot: 5, Frappe: 10)
      TOTAL: TOTAL, // Adds the TOTAL key
    };

    // --- CHANGED SECTION END ---

    const branchMap = {};

    sells.forEach((sell) => {
      const branchName = sell.branch.branchname;
      const product = `${sell.coffeeMenu.name} (${sell.coffeeMenu.size})`;

      if (!branchMap[branchName]) {
        branchMap[branchName] = {
          country: branchName,
          branchInfo: sell.branch, // full branch info
        };
      }

      branchMap[branchName][product] =
        (branchMap[branchName][product] || 0) + sell.sellCount;
    });

    // --- NEW SORTING LOGIC START ---

    let data_for_bar_chart = Object.values(branchMap);

    // 1. Get a list of all product keys to ensure accurate summation
    const allProductKeys = Array.from(
      new Set(data_for_bar_chart.flatMap((item) => Object.keys(item)))
    ).filter((key) => key !== "country" && key !== "branchInfo");

    // 2. Sort the array based on the sum of all product sales (high to low)
    data_for_bar_chart.sort((a, b) => {
      // Function to calculate total sales for a given branch object
      const calculateTotal = (branch) => {
        return allProductKeys.reduce((sum, key) => sum + (branch[key] || 0), 0);
      };

      const totalA = calculateTotal(a);
      const totalB = calculateTotal(b);

      // Sort in descending order (totalB - totalA)
      return totalB - totalA;
    });

    // --- NEW SORTING LOGIC END ---

    const pie_chart_data = Object.entries(typeTotalsType).map(
      ([type, value], i) => ({
        id: type,
        label: type,
        value: value,
        color: `hsl(${i * 40}, 70%, 50%)`, // optional color
      })
    );

    res.json({
      total_type_2,
      data_for_bar_chart, // This array is now sorted
      pie_chart_data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.reportTotalTreekoffDataGrid = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // 1. Fetch sales data and include the related coffeeMenu data
    const salesData = await prisma.coffeeSell.findMany({
      where: {
        sellDate: {
          gte: start,
          lte: end,
        },
      },
      include: {
        coffeeMenu: true, // This brings in the full coffeeMenu object
      },
    });

    // 2. Aggregate the sales data by coffeeMenuId
    const aggregatedDataMap = salesData.reduce((acc, curr) => {
      const menuId = curr.coffeeMenuId;

      if (!acc[menuId]) {
        // Initialize if not present. Use coffeeMenuId as the unique ID for the DataGrid row.
        acc[menuId] = {
          id: menuId, // Required by DataGrid
          // Extract coffee details from the first record found for this menuId
          name: curr.coffeeMenu.name,
          size: curr.coffeeMenu.size,
          sellPrice: curr.coffeeMenu.sellPrice,
          image: curr.coffeeMenu.image,
          size: curr.coffeeMenu.size,
          type: curr.coffeeMenu.type,
          type_2: curr.coffeeMenu.type_2,
          totalSellCount: 0,
          totalRevenue: 0, // Calculate total revenue (optional but useful)
        };
      }

      // Sum the sellCount
      acc[menuId].totalSellCount += curr.sellCount;

      // Calculate and sum total revenue
      const price = curr.coffeeMenu.sellPrice || 0;
      acc[menuId].totalRevenue += curr.sellCount * price;

      return acc;
    }, {});

    // 3. Convert the map back into an array of objects for the DataGrid `rows` prop
    const dataGridRows = Object.values(aggregatedDataMap);

    res.send(dataGridRows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: `server error.` });
  }
};

exports.getReportCoffeeSellByName = async (req, res) => {
  try {
    console.log(req.body);
    let { coffeeName, startDate, endDate } = req.body;

    if (!coffeeName || !startDate || !endDate) {
      return res.status(400).json({
        message: `Missing required parameters: coffeeName, startDate, or endDate.`,
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    let modifierType2 = null;

    // Regex 1: Find and CAPTURE the content inside parentheses
    const modifierRegex = /\(([^)]+)\)/;
    const match = coffeeName.match(modifierRegex);

    if (match) {
      // match[1] holds the captured text inside the parentheses (e.g., "TALL")
      modifierType2 = match[1].trim();
    }

    // Regex 2: Remove the parentheses and contents (and any leading space)
    const cleanupRegex = /\s*\([^)]*\)/g;
    // Clean the name and use .trim() to remove any leading/trailing spaces,
    // especially those left from the space before the parenthesis.
    coffeeName = coffeeName.replace(cleanupRegex, "").trim();

    console.log(coffeeName)
    console.log(modifierType2)

    const menuItems = await prisma.coffeeMenu.findMany({
      where: {
        // Apply the filters dynamically
        AND: [
          { name: coffeeName},
          {size: modifierType2 }
        ],
      },
      select: { id: true },
    });

    if (menuItems.length === 0) {
      return res.status(404).json({
        message: `No coffee menu found matching the name: ${coffeeName}.`,
      });
    }

    const menuIds = menuItems.map((item) => item.id);

    const salesReport = await prisma.coffeeSell.findMany({
      where: {
        AND: [
          { sellDate: { gte: start, lte: end } },
          { coffeeMenuId: { in: menuIds } },
        ],
      },
      include: {
        coffeeMenu: true,
        branch: true,
      },
    });

    // --- 3 & 4: Aggregation (No Change) ---
    const branchMap = {};
    const nivoKeys = new Set();

    salesReport.forEach((sale) => {
      const branchName = sale.branch.branchname;
      const menuName = sale.coffeeMenu.name;
      const count = sale.sellCount;

      nivoKeys.add(menuName);

      if (!branchMap[branchName]) {
        branchMap[branchName] = { branch: branchName };
      }

      const currentCount = branchMap[branchName][menuName] || 0;
      branchMap[branchName][menuName] = currentCount + count;
    });

    // 4. แปลง Map ให้เป็น Array
    const groupedSalesData = Object.values(branchMap);

    // --- 5. SORTING LOGIC ADDED HERE ---
    // Sort the data from highest value (high) to lowest value (low)
    const sortedData = groupedSalesData.sort((a, b) => {
      // The sorting key is the name of the coffee being queried (e.g., "ICED CAPPUCCINO")
      const valueA = a[coffeeName] || 0;
      const valueB = b[coffeeName] || 0;

      // Descending sort (B minus A)
      return valueB - valueA;
    });

    // 6. ส่งผลลัพธ์: ใช้ข้อมูลที่เรียงลำดับแล้ว (sortedData)
    return res.send({
      data: sortedData,
      keys: Array.from(nivoKeys),
      indexBy: "branch",
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: `Server error during sales report generation.` });
  }
};

exports.getCoffeeSellMenuFromType = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.body;

    console.log(req.body);

    if (!type || !startDate || !endDate) {
      return res.status(400).json({ message: `empty value.` });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // --- 1. Find all relevant CoffeeMenu IDs, Names, and Sizes (No Change) ---

    const menuItems = await prisma.coffeeMenu.findMany({
      where: {
        type: type,
      },
      select: { id: true, name: true, type: true, size: true },
    });

    if (menuItems.length === 0) {
      return res.status(404).json({
        message: `No coffee menu found matching the type: ${type}.`,
      });
    }

    const menuIds = menuItems.map((item) => item.id);
    const menuMap = menuItems.reduce((map, item) => {
      const label = item.size ? `${item.name} ${item.size}` : item.name;
      map[item.id] = label;
      return map;
    }, {}); // --- 2. Aggregate sales data using $groupBy (No Change) ---

    const aggregatedSales = await prisma.coffeeSell.groupBy({
      by: ["coffeeMenuId"],
      where: {
        AND: [
          { sellDate: { gte: start, lte: end } },
          { coffeeMenuId: { in: menuIds } },
        ],
      },
      _sum: {
        sellCount: true,
      },
    }); // --- 3. Format and Sort the result for the Bar Chart ---

    const pieChartData = aggregatedSales
      .map((item) => {
        const totalValue = item._sum.sellCount || 0;
        const combinedLabel = menuMap[item.coffeeMenuId];

        return {
          id: combinedLabel,
          label: combinedLabel,
          value: totalValue,
        };
      })
      .filter((item) => item.value > 0)

      // 👇 MODIFIED: Sort by 'value' (sellCount) in descending order (highest first)
      .sort((a, b) => a.value - b.value); // --- 4. Send the structured data (No Change) ---

    res.send({ pie_chart_data: pieChartData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: `server error.` });
  }
};
