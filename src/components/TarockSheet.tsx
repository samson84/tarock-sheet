import React, { useState } from "react";
import { getAllBids, Bid } from "../lib/bid";
import BidSelector from "./BidSelector";
import sortBy from "lodash/fp/sortBy"
import { Contract } from "../lib/contract";

const allBids = sortBy((b: Bid) => b.type )(getAllBids())

export default () => {
  const [contract, setContract] = useState<Contract|null>(null)
  return (
    <>
      <BidSelector bids={allBids} onAddContract={setContract}/>
      <pre>{JSON.stringify(contract, null, 2)}</pre>
    </>
  
    )
}