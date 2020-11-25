import React from "react";
import {Grid} from "@material-ui/core"
import { BID_TYPE, getAllBids, Bid } from "../lib/bid";
import { upperCaseToWords } from "../lib/util";
import BidElement from "./Bid";
import sortBy from "lodash/fp/sortBy"

const allBids = sortBy((b: Bid) => b.type )(getAllBids())

export default function() {
  return (
    <Grid container spacing={1}>
      {allBids.map(bid => (
        <Grid item>
          <BidElement bid={bid}/>
        </Grid>
      )) }
    </Grid>
  )
}