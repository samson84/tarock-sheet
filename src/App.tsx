import React from "react";
import {
  AppBar,
  Box,
  Container,
  Grid,
  makeStyles,
  Typography as T,
} from "@material-ui/core";
import { GiJesterHat as Icon } from "react-icons/gi";
import TarockSheet from "./components/TarockSheet";

const useAppStyle = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
  },
}));

function App() {
  const classes = useAppStyle();

  return (
    <>
      <AppBar position="static">
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Box mt={1} ml={1} fontSize="h3.fontSize">
              <Icon color="white" />
            </Box>
          </Grid>
          <Grid item>
            <T variant="h3">Tarock Sheet</T>
          </Grid>
        </Grid>
      </AppBar>
      <Container className={classes.container}>
        <TarockSheet />
      </Container>
    </>
  );
}

export default App;
