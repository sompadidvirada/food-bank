import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import ProgressCircle from "./ProgressCircle";
import { tokens } from "../../theme";

const StatusBox = ({ title, subtitle, icon, increase }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" m="0 30px">
      <Box display="flex">
        <Box
          display={"flex"}
          gap={1}
          width={"100%"}
        >
          {icon}
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            {title}
          </Typography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" mt="2px" gap={2}>
        <Typography variant="h5" sx={{ color: colors.grey[100] }}>
          {subtitle}
        </Typography>
        <Typography
          variant="laoText"
          fontStyle="italic"
          fontSize={14}
          sx={{
            color:
              increase?.color === "green" ? colors.greenAccent[500] : "red",
          }}
        >
          {increase?.text}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatusBox;
