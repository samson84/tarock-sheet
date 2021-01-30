import React from "react";
import { IconButton, Typography as T } from "@material-ui/core";
import {
  MdArrowUpward as DoubleContraIcon,
  MdArrowDownward as DivideContraIcon,
} from "react-icons/md";
interface MultiplierSelectorProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}
const MultiplierSelector = ({
  value,
  onChange,
  disabled,
}: MultiplierSelectorProps) => {
  const handleChange = (value: number) => onChange && onChange(value);
  const handleDivide = () => value > 1 && handleChange(value / 2);
  const handleDouble = () => handleChange(value * 2);

  return (
    <>
      <T
        component={disabled ? "s" : "span"}
        color={disabled ? "textPrimary" : "textSecondary"}
      >
        {value}
      </T>
      <IconButton title="Double" onClick={handleDouble} disabled={disabled}>
        <DoubleContraIcon />
      </IconButton>
      <IconButton
        title="Divide by 2"
        onClick={handleDivide}
        disabled={value === 1 || disabled}
      >
        <DivideContraIcon />
      </IconButton>
    </>
  );
};

export default MultiplierSelector;
