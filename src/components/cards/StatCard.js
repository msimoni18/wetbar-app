import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function StatCard({ title = "", stat = "" }) {
  return (
    <Box sx={ { minWidth: 275 } }>
      <Card variant="outlined">
        <CardContent>
          <Typography
            sx={ { fontSize: 14 } }
            color="text.secondary"
            gutterBottom
          >
            {title}
          </Typography>
          <Typography
            variant="h5"
            component="div"
          >
            {stat}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
