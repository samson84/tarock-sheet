import React, { useState } from "react";
import {
  Button,
  Grid,
  Box,
  Typography as T,
  Switch,
  FormControlLabel,
} from "@material-ui/core";
import * as Bid from "../models/Bid";
import { upperCaseToWords } from "../lib/util";
import * as Contract from "../models/Contract";
import * as Player from "../models/Player";

interface BidSelectorProps {
  bidsByGroup: Bid.ByGroup;
  onAddContract: (contract: Partial<Contract.Props>) => void;
}
const ContractSelector = ({ bidsByGroup, onAddContract }: BidSelectorProps) => {
  const [silentAndWin, setSilentAndWin] = useState<boolean>(false);

  const handleSwitch = () => {
    setSilentAndWin((prev: boolean) => !prev);
  };
  const handleClick = (bidType: Bid.TYPE) => {
    const bid = Bid.getByType(bidType);
    const shouldWinWithSilent = silentAndWin && !bid.isNotWinIfSilent;
    onAddContract({
      bidType: bidType,
      taker: Player.TYPE.DECLARER,
      isSilent: silentAndWin && Bid.canSilent(bid),
      bidVariant: null,
      isWonByTaker: bid.isWinByDefault || shouldWinWithSilent || null,
    });
  };
  return (
    <Grid container spacing={1} alignItems="flex-end">
      {Bid.getGroupsOrderedByWeight().map((group) => (
        <Grid item key={group}>
          <T variant="caption" display="block" color="textSecondary">
            {upperCaseToWords(group)}
          </T>
          {bidsByGroup[group as Bid.GroupType].map((bid) => (
            <Box key={bid.type} component="span" mr={0.5}>
              <Button
                variant="outlined"
                color="default"
                onClick={() => handleClick(bid.type)}
                size="small"
                disabled={silentAndWin && !Bid.canSilent(bid)}
              >
                {upperCaseToWords(bid.type)}
              </Button>
            </Box>
          ))}
        </Grid>
      ))}
      <Grid item>
        <FormControlLabel
          control={
            <Switch
              checked={silentAndWin}
              onChange={handleSwitch}
              name="silentAndWinSwitch"
              color="default"
            />
          }
          label="Silent & Win"
        />
      </Grid>
    </Grid>
  );
};

export default ContractSelector;
