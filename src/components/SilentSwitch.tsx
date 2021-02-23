import React from "react";
import { Switch, FormControlLabel, FormGroup } from "@material-ui/core";
import * as Bid from "../models/Bid";

interface SilentSwitchProps {
  bidType: Bid.TYPE;
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
  const bid = Bid.getByType(bidType);
  if (!Bid.canSilent(bid)) {
    return null;
  }
  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            onChange={(event) => onChange(event.target.checked)}
            checked={value}
            color="default"
          />
        }
        label={label ? "Silent" : ""}
      />
    </FormGroup>
  );
};
export default SilentSwitch;
