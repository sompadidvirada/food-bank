import React from "react";
import useFoodBankStorage from "../../../zustand/foodbank-storage";

const CompoPrint = ({ componentRef, orders, products }) => {
  const dateConfirmOrder = useFoodBankStorage(
    (state) => state.dateConfirmOrder
  );
  // 1. Get all unique branch names
  const branchNames = Array.from(
    new Set(orders.map((o) => o.branch?.branchname || "Unknown"))
  );
  const filterProducts = products?.filter((product) => {
    const hasValidCategory = product.category?.name !== "ເຄື່ອງດື່ມ ແອວກໍຮໍ";

    const isAvailable =
      Array.isArray(product.available) &&
      product.available.some(
        (item) => item.aviableStatus === true && item.branchId === 1
      );

    return hasValidCategory && isAvailable;
  });

  // 2. Pivot data: Map productId -> { productName, price, branchQuantities, total }
  const pivotData = filterProducts.map((product) => {
    const row = {
      id: product.id,
      name: product.name,
      price: product.price || 0,
      branches: {},
      total: 0,
    };

    branchNames.forEach((branch) => {
      const qty = orders
        .filter(
          (o) =>
            o.productsId === product.id &&
            (o.branch?.branchname || "Unknown") === branch
        )
        .reduce((sum, o) => sum + (o.orderCount || 0), 0);

      row.branches[branch] = qty;
      row.total += qty;
    });

    return row;
  });

  // 3. Totals per branch (bottom row)
  const branchTotals = {};
  branchNames.forEach((branch) => {
    branchTotals[branch] = pivotData.reduce(
      (sum, row) => sum + row.branches[branch],
      0
    );
  });
  const grandTotalQty = pivotData.reduce((sum, row) => sum + row.total, 0);

  // 4. Colors for specific product types
  const getRowColor = (name) => {
    if (name.toLowerCase().includes("red velvet")) return "#53c8ffff"; // red
    if (name.toLowerCase().includes("croissant")) return "#eeb919ff"; // light yellow
    if (name.toLowerCase().includes("croffle")) return "#f2ecdbff"; // light orange
    if (name.toLowerCase().includes("egg")) return "#efd893ff"; // light orange
    if (name.toLowerCase().includes("choux")) return "#ff8f2cff"; // light orange
    if (name.toLowerCase().includes("timber")) return "#b9a43eff"; // light orange
    if (name.toLowerCase().includes("cake")) return "#53c8ffff"; // light blue
    if (name.toLowerCase().includes("coco")) return "#53c8ffff"; // light blue
    if (name.toLowerCase().includes("chocolate top")) return "#53c8ffff"; // light blue
    return "white";
  };

  return (
    <div ref={componentRef} style={{ padding: 20, color: "black" }}>
      <p style={{ fontFamily: "Noto Sans Lao", fontSize: 30 }}>
        ອໍເດີປະຈຳວັນທີ່ {dateConfirmOrder.orderDate}
      </p>
      <table
        border={1}
        cellPadding={5}
        cellSpacing={0}
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "center",
        }}
      >
        <thead>
          {/* First header row */}
          <tr style={{ background: "yellow", fontWeight: "bold", fontFamily:"Noto Sans Lao" }}>
            <th rowSpan={2}>ລາຍການ</th>
            {branchNames.map((branch) => (
              <th key={branch} rowSpan={1}>
                {branch}
              </th>
            ))}
            <th rowSpan={2}>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {pivotData.map((row) => (
            <tr
              key={row.id}
              style={{
                background: getRowColor(row.name),
                fontWeight: row.name.toLowerCase().includes("red velvet")
                  ? "bold"
                  : "normal",
              }}
            >
              <td style={{ textAlign: "left" }}>{row.name}</td>
              {branchNames.map((branch) => (
                <td key={branch}>{row.branches[branch] || ""}</td>
              ))}
              <td>{row.total}</td>
            </tr>
          ))}

          {/* Totals row */}
          <tr style={{ fontWeight: "bold", background: "#f2f2f2", fontFamily:"Noto Sans Lao" }}>
            <td>ລວມ</td>
            {branchNames.map((branch) => (
              <td key={branch}>{branchTotals[branch]}</td>
            ))}
            <td>{grandTotalQty}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CompoPrint;
