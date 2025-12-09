import React, { forwardRef } from "react";
import { format, parseISO } from "date-fns";

const ComponentToPrint = forwardRef(
  (
    {
      detailedSalesData,
      aggregatedCounts,
      grandTotalUnitsSold,
      selectDateBrachCheck
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
      <h2 style={{ textAlign: "center" }}>{`....`}</h2>
      <h2>
        ປະຈຳວັນທີ:{selectDateBrachCheck?.sellDate ? format(parseISO(selectDateBrachCheck?.sellDate), "dd/MM/yyyy") : "..."}
      </h2>
      <h2>
        ລວມເປັນຈຳນວນຈອກທັງໝົດ: {grandTotalUnitsSold? grandTotalUnitsSold.toLocaleString() : 0}  ຈອກ
      </h2>
      <h2>
        ເຢັນ: {aggregatedCounts?.ICED ? aggregatedCounts?.ICED.toLocaleString() : 0}  ຈອກ
      </h2>
      <h2>
        ຮ້ອນ: {aggregatedCounts?.HOT ? aggregatedCounts?.HOT.toLocaleString() : 0} ຈອກ
      </h2>
      <h2>
        ປັ່ນ: {aggregatedCounts?.SMOOTIE ? aggregatedCounts?.SMOOTIE.toLocaleString() : 0} ຈອກ
      </h2>
      

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
              ຊື່ເມນູ
            </th>
            <th style={{ border: "1px solid black", padding: "6px" }}>
              ຂະໝາດຈອກ
            </th>
            <th style={{ border: "1px solid black", padding: "6px" }}>
              ປະເພດເຄື່ອງດື່ມ
            </th>
            <th style={{ border: "1px solid black", padding: "6px" }}>
              ຈຳນວນທີ່ໄດ້ຂາຍ
            </th>
          </tr>
        </thead>
        <tbody>
          {detailedSalesData?.map((row, i) => {
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
                  {row?.productName}
                </td>

                {/* variant name */}
                <td style={{ border: "1px solid black", padding: "6px" }}>
                  {row?.productSize}
                </td>

                {/* category */}
                <td style={{ border: "1px solid black", padding: "6px" }}>
                  {row?.menuDetails?.type}
                </td>

                 <td style={{ border: "1px solid black", padding: "6px" }}>
                  {row?.sellCount}
                </td>

                {/* quantities (you’ll need to pass if you have them in your data) */}
              
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )
);

export default ComponentToPrint;
