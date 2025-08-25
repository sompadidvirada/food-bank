import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const SelectMaterialVariantToInsert = ({
  materialVariant,
  rawMaterialId,
  categoryMeterailId,
  categoryMeterailName,
  setRawMaterialVariants,
}) => {
  const [selectedVariant, setSelectedVariant] = useState("");

  useEffect(() => {
    if (materialVariant && materialVariant.length > 0) {
      const firstVariant = materialVariant[0];
      setSelectedVariant(firstVariant.id);

      updateRawMaterialVariants(firstVariant);
    }
  }, [materialVariant]);

  const updateRawMaterialVariants = (variant) => {
    setRawMaterialVariants((prev) => {
      const newEntry = {
        rawMaterialId,
        categoryMeterailId,
        categoryMeterailName,
        materialVariantId: variant.id,
        barcode: variant.barcode,
        costPriceBath: variant.costPriceBath,
        costPriceKip: variant.costPriceKip,
        sellPriceBath: variant.sellPriceBath,
        sellPriceKip: variant.sellPriceKip,
        variantName: variant.variantName,
      };

      // Replace or insert this rawMaterialId
      const filtered = prev?.filter((x) => x.rawMaterialId !== rawMaterialId);
      return [...filtered, newEntry];
    });
  };

  const handleChange = (event) => {
    const selectedId = event.target.value;
    setSelectedVariant(selectedId);

    const selectedVariantObj = materialVariant.find(
      (item) => item.id === selectedId
    );

    if (selectedVariantObj) {
      updateRawMaterialVariants(selectedVariantObj);
    }
  };

  return (
    <Box>
      <FormControl sx={{ minWidth: 120, m: 1 }}>
        <Select
          size="small"
          value={selectedVariant}
          onChange={handleChange}
          sx={{
            fontFamily: "Noto Sans Lao",
            fontSize: "14px",
            fontWeight: 500,
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                fontFamily: "Noto Sans Lao",
                fontSize: "14px",
              },
            },
          }}
        >
          {materialVariant?.map((item) => (
            <MenuItem
              key={item.id}
              value={item.id}
              sx={{
                fontFamily: "Noto Sans Lao, sans-serif",
                fontSize: "14px",
              }}
            >
              {item.variantName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SelectMaterialVariantToInsert;
