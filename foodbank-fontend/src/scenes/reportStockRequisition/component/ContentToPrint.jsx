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
      <p>
        ປະຈຳວັນທີ:{" "}
        {queryForm?.startDate
          ? format(parseISO(queryForm.startDate), "dd/MM/yyyy")
          : "-"}{" "}
        -{" "}
        {queryForm?.endDate
          ? format(parseISO(queryForm.endDate), "dd/MM/yyyy")
          : "-"}
      </p>
      <p>ລວມເປັນມູນຄ່າເບີກກີບທັງໝົດ: {totals.totalKip.toLocaleString()} ກີບ</p>
      <p>ລວມເປັນມູນຄ່າເບີກບາດທັງໝົດ: {totals.totalBath.toLocaleString()} ບາດ</p>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid black",
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "4px" }}>ລຳດັບ</th>
            <th style={{ border: "1px solid black", padding: "4px" }}>
              ຊື່ວັດຖຸດິບ
            </th>
            <th style={{ border: "1px solid black", padding: "4px" }}>
              ບັນຈຸພັນ
            </th>
            <th style={{ border: "1px solid black", padding: "4px" }}>
              ໝວດໝູ່
            </th>
            <th style={{ border: "1px solid black", padding: "4px" }}>
              ຈຳນວນທີ່ເບີກ
            </th>
            <th style={{ border: "1px solid black", padding: "4px" }}>
              ລາຄາຕົ້ນທືນ/ລາຍການ
            </th>
            <th style={{ border: "1px solid black", padding: "4px" }}>
              ລາຄາຂາຍ/ລາຍການ
            </th>
            <th style={{ border: "1px solid black", padding: "4px" }}>
              ມູນຄ່າຈັດສົ່ງເປັນກີບທັງໝົດ
            </th>
            <th style={{ border: "1px solid black", padding: "4px" }}>
              ມູນຄ່າຈັດສົ່ງເປັນບາດທັງໝົດ
            </th>
          </tr>
        </thead>
        <tbody>
          {rawMaterialVariants?.map((row, i) => {
            // find raw material by rawMaterialId
            const matchedRaw = rawMaterial.find(
              (rm) => rm.id === row.rawMaterialId
            );

            const matchReq = stockRequisitionData
              ?.find((v) => v.id === row.rawMaterialId)
              ?.Allstockrequisition.find((r) => r.id === row.materialVariantId);

            return (
              <tr key={i}>
                {/* index */}
                <td
                  style={{
                    border: "1px solid black",
                    padding: "4px",
                    textAlign: "center",
                  }}
                >
                  {i + 1}
                </td>

                {/* rawMaterial name */}
                <td style={{ border: "1px solid black", padding: "4px" }}>
                  {matchedRaw ? matchedRaw.name : "-"}
                </td>

                {/* variant name */}
                <td style={{ border: "1px solid black", padding: "4px" }}>
                  {row.variantName}
                </td>

                {/* category */}
                <td style={{ border: "1px solid black", padding: "4px" }}>
                  {matchedRaw?.categoryMeterail?.name || "-"}
                </td>

                {/* quantities (you’ll need to pass if you have them in your data) */}
                <td
                  style={{
                    border: "1px solid black",
                    padding: "4px",
                    textAlign: "right",
                  }}
                >
                  {matchReq?.quantityRequition !== null
                    ? Number.isInteger(matchReq?.quantityRequition)
                      ? `${matchReq?.quantityRequition} (${row.variantName})`
                      : `${matchReq?.quantityRequition.toFixed(3)} (${row.variantName})`
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
                  {row.costPriceKip.toLocaleString()} ກີບ /{" "}
                  {row.costPriceBath.toLocaleString()} ບາດ
                </td>

                {/* sell price */}
                <td
                  style={{
                    border: "1px solid black",
                    padding: "4px",
                    textAlign: "right",
                  }}
                >
                  {row.sellPriceKip.toLocaleString()} ກີບ /{" "}
                  {row.sellPriceBath.toLocaleString()} ບາດ
                </td>

                {/* totals */}
                <td
                  style={{
                    border: "1px solid black",
                    padding: "4px",
                    textAlign: "right",
                  }}
                >
                  {matchReq?.totalPriceKip !== null
                    ? Number.isInteger(matchReq?.totalPriceKip)
                      ? `${matchReq?.totalPriceKip.toLocaleString("en-US")} ກິບ`
                      : `${matchReq?.totalPriceKip
                          .toLocaleString("en-US")
                          .toFixed(3)}`
                    : "-"}
                </td>
                <td
                  style={{
                    border: "1px solid black",
                    padding: "4px",
                    textAlign: "right",
                  }}
                >
                  {matchReq?.totalPriceBath !== null
                    ? Number.isInteger(matchReq?.totalPriceBath)
                      ? `${matchReq?.totalPriceBath.toLocaleString(
                          "en-US"
                        )} ບາດ`
                      : `${matchReq?.totalPriceBath
                          .toLocaleString("en-US")
                          .toFixed(3)}`
                    : "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div
        style={{ marginTop: "40px", textAlign: "left", marginLeft: "150px" }}
      >
        <p
          style={{
            fontWeight: "bold",
            fontFamily: "Noto Sans Lao",
            fontSize: 16,
            marginLeft: 20,
          }}
        >
          ຜູ້ລາຍງານ
        </p>
        <p
          style={{
            textTransform: "uppercase",
            fontFamily: "Noto Sans Lao",
            fontSize: 17,
            marginTop: 160,
          }}
        >
          {user?.firstname} {user?.lastname}
        </p>
      </div>
    </div>
  )
);

export default ContentToPrint;
