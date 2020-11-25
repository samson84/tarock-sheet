import React from "react";
import { Container, Paper, Typography as T } from "@material-ui/core";
import { CgCardHearts as Icon } from "react-icons/cg";
import TarockSheet from "./components/TarockSheet";


function App() {
  return (
    <Container>
        <T variant="h2"><Icon color="red" /> Tarock Sheet</T>
        <TarockSheet />
    </Container>
  );
}

export default App;