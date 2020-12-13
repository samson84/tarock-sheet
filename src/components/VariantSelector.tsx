import React, { ChangeEvent } from "react";
import { FormControlLabel, RadioGroup, Radio } from "@material-ui/core";
import { BidVariant, BID_TYPE, getBid } from "../lib/bid";

interface VariantSelectorProps {
  onChange: (value: BidVariant) => void;
  bidType: BID_TYPE;
  selected?: BidVariant | null;
}
const VariantSelector = (props: VariantSelectorProps) => {
  const {
    onChange,
    bidType,
    selected = null,
  } = props;
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value as BidVariant);
  };
  const bid = getBid(bidType);
  if (!bid.variants) {
    return null;
  }
  return (
    <RadioGroup name="variants" onChange={handleChange} value={selected}>
      {bid.variants.map((variant) => (
        <FormControlLabel control={<Radio value={variant} />} label={variant} />
      ))}
    </RadioGroup>
  );
};

export default VariantSelector;
