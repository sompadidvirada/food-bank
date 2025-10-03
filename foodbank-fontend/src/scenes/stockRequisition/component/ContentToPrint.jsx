import React, { forwardRef } from "react";
import { format, parseISO } from "date-fns";

const ContentToPrint = forwardRef(
  (
    {
      branchName,
      queryForm,
      totals,
      rawMaterialVariants,
      rawMaterial,
      stockRequisitionData,
      user,
    },
    ref
  ) => (
    <div
      ref={ref}
      style={{
        fontFamily: "'Noto Sans Lao', Arial, sans-serif",
        padding: "20px",
        color: "black",
      }}
    >
      <h2 style={{ textAlign: "center" }}>{branchName}</h2>
      <h2>
        ປະຈຳວັນທີ:{" "}
        {queryForm?.requisitionDate
          ? format(parseISO(queryForm.requisitionDate), "dd/MM/yyyy")
          : "-"}{" "}
      </h2>
      <h2>ລວມເປັນມູນຄ່າເບີກກີບທັງໝົດ: {totals.totalKip.toLocaleString()} ກີບ</h2>
      <h2>ລວມເປັນມູນຄ່າເບີກບາດທັງໝົດ: {totals.totalBath.toLocaleString()} ບາດ</h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid black",
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "6px" }}>ລຳດັບ</th>
            <th style={{ border: "1px solid black", padding: "6px" }}>
              ຊື່ວັດຖຸດິບ
            </th>
            <th style={{ border: "1px solid black", padding: "6px" }}>
              ບັນຈຸພັນ
            </th>
            <th style={{ border: "1px solid black", padding: "6px" }}>
              ໝວດໝູ່
            </th>
            <th style={{ border: "1px solid black", padding: "6px" }}>
              ຈຳນວນທີ່ຈັດສົ່ງ
            </th>
            <th style={{ border: "1px solid black", padding: "6px" }}>
              ລາຄາຕົ້ນທືນ/ລາຍການ
            </th>
            <th style={{ border: "1px solid black", padding: "6px" }}>
              ລາຄາຂາຍ/ລາຍການ
            </th>
            <th style={{ border: "1px solid black", padding: "6px" }}>
              ມູນຄ່າຈັດສົ່ງເປັນກີບທັງໝົດ
            </th>
          </tr>
        </thead>
        <tbody>
          {stockRequisitionData?.map((row, i) => {
            // find raw material by rawMaterialId
            const matchedMate = rawMaterial?.find((rm) =>
              rm.materialVariant.some((mv) => mv.id === row.materialVariantId)
            );

            // also find the specific variant inside it
            const matchedVariant = matchedMate?.materialVariant.find(
              (mv) => mv.id === row.materialVariantId
            );
            return (
              <tr key={i}>
                {/* index */}
                <td
                  style={{
                    border: "1px solid black",
                    padding: "6px",
                    textAlign: "center",
                  }}
                >
                  {i + 1}
                </td>

                {/* rawMaterial name */}
                <td style={{ border: "1px solid black", padding: "6px" }}>
                  {matchedMate ? matchedMate?.name : "-"}
                </td>

                {/* variant name */}
                <td style={{ border: "1px solid black", padding: "6px" }}>
                  {matchedVariant?.variantName}
                </td>

                {/* category */}
                <td style={{ border: "1px solid black", padding: "6px" }}>
                  {matchedMate?.categoryMeterail?.name || "-"}
                </td>

                {/* quantities (you’ll need to pass if you have them in your data) */}
                <td
                  style={{
                    border: "1px solid black",
                    padding: "6px",
                    textAlign: "right",
                  }}
                >
                  {row?.quantityRequisition !== null
                    ? Number.isInteger(row?.quantityRequisition)
                      ? `${row?.quantityRequisition} (${matchedVariant?.variantName})`
                      : `${row?.quantityRequisition.toFixed(3)} (${
                          matchedVariant?.variantName
                        })`
                    : "-"}
                </td>

                {/* cost price */}
                <td
                  style={{
                    border: "1px solid black",
                    padding: "4px",
                    textAlign: "right",
                  }}
                >
                  {row.unitPriceKip.toLocaleString()} ກີບ /{" "}
                  {row.unitPriceBath.toLocaleString()} ບາດ
                </td>

                {/* sell price */}
                <td
                  style={{
                    border: "1px solid black",
                    padding: "4px",
                    textAlign: "right",
                  }}
                >
                  {row.unitPriceKip.toLocaleString()} ກີບ /{" "}
                  {row.unitSellPriceBath.toLocaleString()} ບາດ
                </td>

                {/* totals */}
                <td
                  style={{
                    border: "1px solid black",
                    padding: "4px",
                    textAlign: "right",
                  }}
                >
                  {row?.totalPriceKip !== null || row?.totalPriceBath !== null
                    ? Number.isInteger(row?.totalPriceKip)
                      ? `${row?.totalPriceKip.toLocaleString("en-US")} ກິບ / ${row?.totalPriceBath.toLocaleString("en-US")} ບາດ`
                      : `${row?.totalPriceKip.toFixed(3)} / ${row?.totalPriceBath.toFixed(3)}`
                    : "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )
);

export default ContentToPrint;
