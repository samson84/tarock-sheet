import React, { useState } from "react";
import { getAllBids, Bid } from "../lib/bid";
import BidSelector from "./BidSelector";
import sortBy from "lodash/fp/sortBy";
import {
  Game,
  createGame,
  addContract,
  updateGame,
  updateGameContract,
  removeContract,
  PARTY_SCORE,
  updateValidations,
  removePlayer,
  addPlayer,
} from "../lib/game";
import { Contract, createContract, updateContract } from "../lib/contract";
import { Button, Grid } from "@material-ui/core";
import ContractsTable from "./ContractsTable";
import GameProperties from "./GameProperties";
import flow from "lodash/fp/flow";
import uniq from "lodash/fp/uniq";
import GameScore from "./GameScore";
import Players from "./Players";
import { Player, PLAYER_TYPE } from "../lib/player";

const allBids = sortBy((b: Bid) => b.type)(getAllBids());

const TarockSheet = () => {
  const [game, setGame] = useState<Game>(createGame());
  const [players, setPlayers] = useState<Player[]>([]);

  const handleContractDelete = (index: number) =>
    setGame(flow(removeContract(game as Game), updateValidations)(index));
  const handleResetGame = () => setGame(createGame());
  const handleAddPlayer = (player: Player) =>
    setPlayers((prev) => uniq([...prev, player]));
  const handleRemovePlayer = (player: Player) =>
    setPlayers((prev) => prev.filter((p) => p !== player));
  const handleChangePlayer = (
    player: Player,
    playerType: PLAYER_TYPE | null
  ) => {
    if (playerType === null) {
      setGame(removePlayer(player)(game));
    } else {
      setGame(addPlayer(player, playerType)(game));
    }
  };

  const hasGame = game !== null;

  return (
    <Grid container spacing={3} direction="column">
      <Grid item>
        <Grid item container spacing={1} direction="row">
          <Grid item>
            <Button variant="contained" onClick={handleResetGame}>
              Reset Game
            </Button>
          </Grid>
          <Grid item>
            <GameProperties
              game={game as Game}
              onChange={(prop, value) => {
                setGame(
                  flow(
                    updateGame({ [prop]: value }),
                    updateValidations
                  )(game as Game)
                );
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Players
          players={players}
          game={game}
          onPlayerAdd={handleAddPlayer}
          onPlayerRemove={handleRemovePlayer}
          onPlayerChange={handleChangePlayer}
        />
      </Grid>
      <Grid item>
        <GameScore game={game} />
      </Grid>
      <Grid item>
        {hasGame ? (
          <>
            <BidSelector
              bids={allBids}
              onAddContract={(contractProps) => {
                const partyScore = game?.partyScoreType
                  ? PARTY_SCORE[game?.partyScoreType]
                  : null;
                return setGame(
                  flow(
                    createContract,
                    addContract(game as Game),
                    updateValidations
                  )({
                    ...contractProps,
                    partyScore,
                  })
                );
              }}
            />
            <ContractsTable
              contracts={game?.contracts as Contract[]}
              onChange={(index, field, value) => {
                setGame(
                  flow(
                    updateContract({ [field]: value }),
                    updateGameContract(game as Game)(index),
                    updateValidations
                  )((game as Game).contracts[index])
                );
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
