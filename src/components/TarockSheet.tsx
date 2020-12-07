import React, { useState } from "react";
import { getAllBids, Bid } from "../lib/bid";
import BidSelector from "./BidSelector";
import sortBy from "lodash/fp/sortBy";
import { Game, createGame, addContract, updateGame } from "../lib/game";
import { Contract } from "../lib/contract";
import { Button, Grid } from "@material-ui/core";
import ContractsTable from "./ContractsTable";
import GameProperties from "./GameProperties";

const allBids = sortBy((b: Bid) => b.type)(getAllBids());

const TarockSheet = () => {
  const [game, setGame] = useState<Game | null>(null);

  const hasGame = game !== null;

  return (
    <Grid container spacing={3}>
      <Grid item>
        {!hasGame ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setGame(createGame())}
          >
            New Game
          </Button>
        ) : (
          <Grid item container spacing={1} direction="row">
            <Grid item>
              <Button variant="contained" onClick={() => setGame(null)}>
                Reset Game
              </Button>
            </Grid>
            <Grid item>
              <GameProperties
                game={game as Game}
                onChange={(prop, value) => {
                  setGame(updateGame({ [prop]: value })(game as Game));
                }}
              />
            </Grid>
          </Grid>
        )}
      </Grid>
      <Grid item>
        {hasGame ? (
          <>
            <BidSelector
              bids={allBids}
              onAddContract={(contract) =>
                setGame(addContract(contract)(game as Game))
              }
            />
            <ContractsTable contracts={game?.contracts as Contract[]} />
          </>
        ) : null}
      </Grid>
    </Grid>
  );
};

export default TarockSheet;
