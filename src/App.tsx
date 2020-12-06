import React from "react";
import { AppBar, Container, makeStyles, Paper, Typography as T } from "@material-ui/core";
import { CgCardHearts as Icon } from "react-icons/cg";
import TarockSheet from "./components/TarockSheet";

const useAppStyle = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4)
  }
}))

function App() {
  const classes = useAppStyle()
  
  return (
    <>
      <AppBar position="static">
        <T variant="h2"><Icon color="red" /> Tarock Sheet</T>
      </AppBar>
      <Container className={classes.container}>
        <TarockSheet />
      </Container>
    </>
  );
}

export default App;