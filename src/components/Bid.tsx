import React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Switch,
  FormControlLabel,
  FormGroup,
  Typography as T,
  RadioGroup,
  Radio,
} from "@material-ui/core";

import { Bid, BidVariant, canSilent } from "../lib/bid";
import { upperCaseToWords } from "../lib/util";

interface SilentSwitchProps {
  bid: Bid;
}
const SilentSwitch = ({ bid }: SilentSwitchProps) => {
  if (!canSilent(bid)) {
    return null;
  }
  return (
    <FormGroup>
      <FormControlLabel control={<Switch />} label="Silent" />
    </FormGroup>
  );
};

interface VariantSelectorProps {
  variants?: BidVariant[];
}
const VariantSelector = ({ variants }: VariantSelectorProps) => {
  if (!variants) {
    return null
  }
  return (
    <RadioGroup row name="variants">
      {
        variants.map(variant => (
          <FormControlLabel 
            control={<Radio value={variant} />}
            label={variant}
          />
        ))
      }
    </RadioGroup>
  )
};

interface BidProps {
  bid: Bid;
}
export default function ({ bid }: BidProps) {
  return (
    <Button variant="outlined" color="primary">{upperCaseToWords(bid.type)}</Button>
  );
}
