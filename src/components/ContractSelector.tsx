import React, { useState } from "react";
import {
  Button,
  Grid,
  Box,
  Typography as T,
  Switch,
  FormControlLabel,
} from "@material-ui/core";
import {
  BidsByGroup,
  BidGroupType,
  bidGroupNamesByWeight,
  BID_TYPE,
  getBid,
  canSilent,
} from "../lib/bid";
import { upperCaseToWords } from "../lib/util";
import { Contract } from "../models/contractModel";
import { PLAYER_TYPE } from "../lib/player";

interface BidSelectorProps {
  bidsByGroup: BidsByGroup;
  onAddContract: (contract: Partial<Contract>) => void;
}
const ContractSelector = ({ bidsByGroup, onAddContract }: BidSelectorProps) => {
  const [silentAndWin, setSilentAndWin] = useState<boolean>(false);

  const handleSwitch = () => {
    setSilentAndWin((prev: boolean) => !prev);
  };
  const handleClick = (bidType: BID_TYPE) => {
    const bid = getBid(bidType);
    const shouldWinWithSilent = silentAndWin && !bid.notWinIfSilent;
    onAddContract({
      bidType: bidType,
      taker: PLAYER_TYPE.DECLARER,
      isSilent: silentAndWin && canSilent(bid),
      bidVariant: null,
      winByTaker: bid.winByDefault || shouldWinWithSilent || null,
    });
  };
  return (
    <Grid container spacing={1} alignItems="flex-end">
      {bidGroupNamesByWeight().map((group) => (
        <Grid item key={group} spacing={1}>
          <T variant="caption" display="block" color="textSecondary">
            {upperCaseToWords(group)}
          </T>
          {bidsByGroup[group as BidGroupType].map((bid) => (
            <Box key={bid.type} component="span" mr={0.5}>
              <Button
                variant="outlined"
                color="default"
                onClick={() => handleClick(bid.type)}
                size="small"
                disabled={silentAndWin && !canSilent(bid)}
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
