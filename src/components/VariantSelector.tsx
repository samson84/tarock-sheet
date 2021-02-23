import React, { ChangeEvent, useState, ReactNode } from "react";
import {
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import * as Bid from "../models/Bid";
import { upperCaseToWords } from "../lib/util";

interface VariantSelectorProps {
  render: (handleOpen: () => void) => ReactNode;
  variants: Bid.Variant[];
  selected: Bid.Variant | null;
  onChange: (variant: Bid.Variant) => void;
  onClose?: () => void;
}
const VariantSelector = (props: VariantSelectorProps) => {
  const { variants, selected, onChange, render, onClose } = props;
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value as Bid.Variant);
    handleClose();
  };

  return (
    <>
      {render(handleOpen)}
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <RadioGroup name="variants" onChange={handleChange} value={selected}>
            {variants.map((variant: Bid.Variant) => (
              <FormControlLabel
                control={<Radio color="default" value={variant} />}
                label={upperCaseToWords(variant)}
              />
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VariantSelector;
