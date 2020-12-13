import React from "react";
import { Switch, FormControlLabel, FormGroup } from "@material-ui/core";
import { BID_TYPE, canSilent, getBid } from "../lib/bid";

interface SilentSwitchProps {
  bidType: BID_TYPE;
  onChange: (value: boolean) => void;
  value?: boolean;
  label?: boolean;
}
const SilentSwitch = ({
  bidType,
  onChange,
  value,
  label,
}: SilentSwitchProps) => {
  const bid = getBid(bidType);
  if (!canSilent(bid)) {
    return null;
  }
  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            onChange={(event) => onChange(event.target.checked)}
            checked={value}
          />
        }
        label={label ? "Silent" : ""}
      />
    </FormGroup>
  );
};
export default SilentSwitch;
