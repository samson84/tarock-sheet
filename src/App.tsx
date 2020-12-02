import React from "react";
import { AppBar, Container, Paper, Typography as T } from "@material-ui/core";
import { CgCardHearts as Icon } from "react-icons/cg";
import TarockSheet from "./components/TarockSheet";


function App() {
  return (
    <>
      <AppBar position="static">
        <T variant="h2"><Icon color="red" /> Tarock Sheet</T>
      </AppBar>
      <Container>
        <TarockSheet />
      </Container>
    </>
  );
}

export default App;