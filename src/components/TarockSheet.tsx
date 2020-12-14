import React, { useState } from "react";
import { getAllBids, Bid } from "../lib/bid";
import BidSelector from "./BidSelector";
import sortBy from "lodash/fp/sortBy";
import { Game, createGame, addContract, updateGame, updateGameContract, removeContract } from "../lib/game";
import { Contract, createContract, updateContract} from "../lib/contract";
import { Button, Grid } from "@material-ui/core";
import ContractsTable from "./ContractsTable";
import GameProperties from "./GameProperties";
import { flow } from "lodash";

const allBids = sortBy((b: Bid) => b.type)(getAllBids());

const TarockSheet = () => {
  const [game, setGame] = useState<Game | null>(null);

  const handleContractDelete = (index: number) => setGame(removeContract(game as Game)(index))

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
              onAddContract={(contractProps) =>
                setGame(
                  flow(
                    createContract,
                    addContract(game as Game)
                  )({
                    ...contractProps,
                    partyScore: (game as Game).party_score,
                  })
                )
              }
            />
            <ContractsTable
              contracts={game?.contracts as Contract[]}
              onChange={(index, field, value) => {
                setGame(
                  flow(
                    updateContract({[field]: value}),
                    updateGameContract(game as Game)(index)
                  )(
                    (game as Game).contracts[index]
                  )
                )
              }}
              onDelete={handleContractDelete}
            />
          </>
        ) : null}
      </Grid>
    </Grid>
  );
};

export default TarockSheet;
