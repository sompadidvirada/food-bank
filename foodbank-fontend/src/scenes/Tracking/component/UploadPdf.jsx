import React, { useState } from "react";
import useFoodBankStorage from "../../../zustand/foodbank-storage";

const UploadPdf = ({ handleSetSellCount, setSellCounts }) => {
  const products = useFoodBankStorage((state) => state.products);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const htmlText = await file.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");

    const rows = doc.querySelectorAll("table.list tr");

    const extracted = [];

    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      if (cells.length >= 8) {
        const type = cells[7].textContent.trim();

        if (type === "BAKERY/CAKE" || type === "BEVERAGES") {
          const item = parseInt(cells[0].textContent.trim());
          const menu = cells[2].textContent.trim();
          const sellCount = parseInt(cells[3].textContent.trim());

          const product = products.find(
            (p) => p.name.trim().toLowerCase() === menu.toLowerCase()
          );
          if (!product) {
            console.warn(`⚠️ Menu "${menu}" not found in products`);
          }

          // ✅ Only push if all values valid and product is found
          if (!isNaN(item) && menu && !isNaN(sellCount) && product) {
            extracted.push({
              item,
              menu,
              sellCount,
              type,
              productId: product.id,
            });
          }
        }
      }
    });

    // Optional: Automatically trigger handleSetSellCount(productId)
    // Inside extracted.forEach
    extracted.forEach((entry) => {
      // First update the input display
      setSellCounts((prev) => ({
        ...prev,
        [entry.productId]: entry.sellCount,
      }));

      console.log(
        "📦 Payload to backend:",
        extracted.map((entry) => ({
          productsId: entry.productId,
          sellCount: entry.sellCount,
          branchId: 1, // or get this from state/context
          sellAt: new Date().toISOString(), // or actual sell time
        }))
      );
      // Then call handleSetSellCount with direct value
      setTimeout(() => {
        handleSetSellCount(entry.productId, entry.sellCount);
      }, 150);
    });
  };

  return (
    <div className="p-4">
      <input type="file" accept=".html" onChange={handleFileUpload} />
    </div>
  );
};

export default UploadPdf;
