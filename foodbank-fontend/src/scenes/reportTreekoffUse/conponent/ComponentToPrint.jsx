import React, { forwardRef } from "react";
import { format, parseISO } from "date-fns";

const ComponentToPrint = forwardRef(
  ({ branchName, queryForm, user, rawMaterial, reportCoffeeUse }, ref) => (
    <div
      ref={ref}
      style={{
        fontFamily: "'Noto Sans Lao', Arial, sans-serif",
        padding: "20px",
        color: "black",
        position: "relative",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
      >
        {/* Logo */}
        <img
          src="/TK.png"
          alt="Logo"
          style={{
            height: 80,
            marginRight: 16,
          }}
        />
        {/* Title */}
        <h2 style={{ textAlign: "center", flexGrow: 1, margin: 0 }}>
          ລາຍງານການໃຊ້ວັດຖຸດິບ
        </h2>
      </div>
      <p>{branchName}</p>
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
              ໝວດໝູ່
            </th>
            <th style={{ border: "1px solid black", padding: "4px" }}>
              ຈຳນວນທີ່ເບີກ
            </th>
            <th style={{ border: "1px solid black", padding: "4px" }}>
              ຈຳນວນທີ່ໃຊ້
            </th>
            <th style={{ border: "1px solid black", padding: "4px" }}>
              ສວ່ນຕ່າງ
            </th>
            <th style={{ border: "1px solid black", padding: "4px" }}>
              ເປີເຊັ່ນສ່ວນຕ່າງ
            </th>
          </tr>
        </thead>
        <tbody>
          {rawMaterial?.map((row, i) => {
            const reportSelect = reportCoffeeUse.find(
              (r) => r.materialVariantId === row.materialVariant[0].id
            );
            const totalCalcu =
              reportSelect?.stockRequisition - reportSelect?.ingredientUsage;
            const percentage =
              reportSelect?.stockRequisition > 0
                ? (
                    100 -
                    (totalCalcu / reportSelect.stockRequisition) * 100
                  ).toFixed(2)
                : 0;

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
                <td
                  style={{
                    border: "1px solid black",
                    padding: "4px",
                    textAlign: "left",
                  }}
                >
                  {row.name} ({row.sizeUnit})
                </td>
                <td
                  style={{
                    border: "1px solid black",
                    padding: "4px",
                    textAlign: "center",
                  }}
                >
                  {row.categoryMeterail.name}
                </td>
                <td
                  style={{
                    border: "1px solid black",
                    padding: "4px",
                    textAlign: "right",
                  }}
                >
                  {reportSelect?.stockRequisition.toLocaleString()} (
                  {row.sizeUnit})
                </td>
                <td
                  style={{
                    border: "1px solid black",
                    padding: "4px",
                    textAlign: "right",
                  }}
                >
                  {reportSelect?.ingredientUsage.toLocaleString()} (
                  {row.sizeUnit})
                </td>
                <td
                  style={{
                    border: "1px solid black",
                    padding: "4px",
                    textAlign: "right",
                    color: totalCalcu < 0 ? "green" : "red", // 👈 check negative here
                  }}
                >
                  {totalCalcu
                    ? `${totalCalcu.toLocaleString()} (${row.sizeUnit})`
                    : 0}
                </td>
                <td
                  style={{
                    border: "1px solid black",
                    padding: "4px",
                    textAlign: "right",
                    color: totalCalcu < 0 ? "green" : "red", // 👈 check negative here
                  }}
                >
                  {percentage}%
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

export default ComponentToPrint;
