import React from "react";
import { Button, Grid, Box, Typography as T } from "@material-ui/core";
import {
  Bid,
  BidsByGroup,
  BidGroupType,
  bidGroupNamesByWeight,
  BID_TYPE,
} from "../lib/bid";
import { upperCaseToWords } from "../lib/util";
import { Contract, CreateContractProps } from "../lib/contract";
import { PLAYER_TYPE } from "../lib/player";

interface BidSelectorProps {
  bidsByGroup: BidsByGroup;
  onAddContract: (contract: Partial<Contract>) => void;
}
const ContractSelector = ({ bidsByGroup, onAddContract }: BidSelectorProps) => {
  const handleClick = (bidType: BID_TYPE) => {
    onAddContract({
      bidType: bidType,
      taker: PLAYER_TYPE.DECLARER,
      silent: false,
      bidVariant: null,
    });
  };
  return (
    <Grid container spacing={1}>
      {bidGroupNamesByWeight().map((group) => (
        <Grid item key={group} spacing={1}>
          <T variant="caption" display="block" color="textSecondary">
            {upperCaseToWords(group)}
          </T>
          {bidsByGroup[group as BidGroupType].map((bid) => (
            <Box key={bid.type} component="span" mr={0.5}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleClick(bid.type)}
                size="small"
              >
                {upperCaseToWords(bid.type)}
              </Button>
            </Box>
          ))}
        </Grid>
      ))}
    </Grid>
  );
};

export default ContractSelector;
