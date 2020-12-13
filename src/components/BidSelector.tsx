import React, { useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Modal,
  makeStyles,
  Grid,
} from "@material-ui/core";

import { Bid, BidVariant, hasVariant } from "../lib/bid";
import { upperCaseToWords } from "../lib/util";
import { Contract, CreateContractProps } from "../lib/contract";
import { PLAYER_TYPE } from "../lib/player";
import VariantSelector from "./VariantSelector";
import SilentSwitch from "./SilentSwitch";

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
              bidType={bid.type}
              onChange={setBidVariant}
            />
            <SilentSwitch
              bidType={bid.type}
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