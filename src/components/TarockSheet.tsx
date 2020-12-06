import React, { useState } from "react";
import { getAllBids, Bid } from "../lib/bid";
import BidSelector from "./BidSelector";
import sortBy from "lodash/fp/sortBy";
import { Game, createGame, addContract } from "../lib/game";
import {Contract} from '../lib/contract'
import { Button, Grid } from "@material-ui/core";
import ContractsTable from "./ContractsTable";

const allBids = sortBy((b: Bid) => b.type)(getAllBids());

const TarockSheet = () => {
  const [game, setGame] = useState<Game | null>(null);

  const hasGame = game !== null;

  const actionButton = !hasGame ? (
    <Button
      variant="contained"
      color="primary"
      onClick={() => setGame(createGame())}
    >
      New Game
    </Button>
  ) : (
    <Button variant="contained" onClick={() => setGame(null)}>
      Reset Game
    </Button>
  );

  const actionContent = hasGame ? (
    <BidSelector bids={allBids} onAddContract={(contract) => setGame(addContract(contract)(game as Game))} />
  ) : null;

  return (
    <Grid container spacing={3}>
      <Grid item>
        <Grid container spacing={1}>
          <Grid item>{actionButton}</Grid>
          <Grid item>{actionContent}</Grid>
        </Grid>
      </Grid>
      <Grid item>
        {
          hasGame ? <ContractsTable contracts={game?.contracts as Contract[]} /> : null
        }
      </Grid>
    </Grid>
  );
};

export default TarockSheet;
