import React, { useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Modal,
  Switch,
  FormControlLabel,
  FormGroup,
  RadioGroup,
  Radio,
  makeStyles,
  Grid,
} from "@material-ui/core";

import { Bid, BidVariant, canSilent, hasVariant } from "../lib/bid";
import { upperCaseToWords } from "../lib/util";
import { Contract, CreateContractProps } from "../lib/contract";
import { PLAYER_TYPE } from "../lib/player";

interface SilentSwitchProps {
  bid: Bid;
  onChange: (value: boolean) => void;
}
const SilentSwitch = ({ bid, onChange }: SilentSwitchProps) => {
  if (!canSilent(bid)) {
    return null;
  }
  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch onChange={(event) => onChange(event.target.checked)} />
        }
        label="Silent"
      />
    </FormGroup>
  );
};

interface VariantSelectorProps {
  onChange: (value: BidVariant) => void;
  variants?: BidVariant[];
}
const VariantSelector = ({ variants, onChange }: VariantSelectorProps) => {
  if (!variants) {
    return null;
  }
  return (
    <RadioGroup name="variants" onChange={(event) => onChange(event.target.value as BidVariant)}>
      {variants.map((variant) => (
        <FormControlLabel
          control={
            <Radio value={variant}  />
          }
          label={variant}
        />
      ))}
    </RadioGroup>
  );
};

const useBidDetailsStyle = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2, 4, 3),
  },
}));
interface BidDetailsProps {
  bid: Bid;
  onSubmit: (contract: Omit<CreateContractProps, "partyScore">) => void;
}
const BidDetails = (props: BidDetailsProps) => {
  const [open, setOpen] = useState(false);
  const [bidVariant, setBidVariant] = useState<BidVariant | null>(null);
  const [silent, setSilent] = useState<boolean | undefined>(undefined);
  const classes = useBidDetailsStyle();
  const { bid, onSubmit } = props;

  const handleSubmit = (taker: PLAYER_TYPE) => {
    setOpen(false);
    onSubmit({ bidType: bid.type, taker, silent, bidVariant});
  };

  const valid = bid.variants
    ? bidVariant === null
      ? false
      : hasVariant(bidVariant)(bid)
    : true

  return (
    <>
      <Button variant="outlined" color="primary" onClick={() => setOpen(true)}>
        {upperCaseToWords(bid.type)}
      </Button>
      <Modal open={open} className={classes.modal}>
        <Card className={classes.card}>
          <CardHeader title={upperCaseToWords(bid.type)} />
          <CardContent>
            <VariantSelector
              variants={bid.variants}
              onChange={setBidVariant}
            />
            <SilentSwitch
              bid={bid}
              onChange={setSilent}
            />
          </CardContent>
          <CardActions>
            <Button
              color="primary"
              variant="contained"
              onClick={handleSubmit.bind(null, PLAYER_TYPE.DECLARER)}
              disabled={!valid}
            >
              Declarer
            </Button>
            <Button
              color="secondary"
              variant="contained"
              onClick={handleSubmit.bind(null, PLAYER_TYPE.OPPONENT)}
              disabled={!valid}
            >
              Opponent
            </Button>
            <Button variant="contained" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </CardActions>
        </Card>
      </Modal>
    </>
  );
};

interface BidSelectorProps {
  bids: Bid[];
  onAddContract: (contract: Contract) => void;
}
const BidSelector = ({ bids, onAddContract }: BidSelectorProps) => {
  return (
    <Grid container spacing={1}>
      {bids.map((bid) => (
        <Grid item key={bid.type}>
          <BidDetails bid={bid} onSubmit={onAddContract} />
        </Grid>
      ))}
    </Grid>
  );
};

export default BidSelector