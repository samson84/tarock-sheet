import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { DialogTitle } from "@material-ui/core";

interface ConfirmProps {
  title?: string;
  text?: string;
  target: (clickHandler: () => void) => React.ReactElement;
  onConfirm: () => void;
}

const Confrim = ({
  text = "",
  title = "",
  target,
  onConfirm,
}: ConfirmProps) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClick = () => {
    setOpen(true);
  };

  const handleOk = () => {
    onConfirm();
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {target(handleClick)}
      <Dialog fullScreen={fullScreen} open={open} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{text}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOk} color="default" variant="outlined">
            Ok, do it!
          </Button>
          <Button
            onClick={handleClose}
            color="default"
            variant="outlined"
            autoFocus
          >
            No, cancel it!
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Confrim;
