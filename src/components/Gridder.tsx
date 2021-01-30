import React from "react";
import { Grid, GridProps } from "@material-ui/core";

interface GridderProps extends GridProps {
  children: React.ReactElement[];
}
const Gridder = ({ children, ...containerProps }: GridderProps) => {
  return (
    <Grid container {...containerProps}>
      {children.map((child: React.ReactElement) => (
        <Grid item>{child}</Grid>
      ))}
    </Grid>
  );
};

export default Gridder;
