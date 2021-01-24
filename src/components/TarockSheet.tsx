import React, { useState } from "react";
import { getAllBids, Bid, BID_TYPE } from "../lib/bid";
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
  removePlayer,
  addPlayer,
  UpdateGameProps,
  removeAllContract,
  isPartyLike,
  addContractFlipped,
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
import { GameScorePerPlayer, getPlayersScores } from "../lib/gameList";
import ScoreSheet from "./ScoreSheet";

const allBids = sortBy((b: Bid) => b.type)(getAllBids());

const TarockSheet = () => {
  const [game, setGame] = useState<Game>(createGame());
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameScoreList, setGameScoreList] = useState<GameScorePerPlayer[]>([]);

  const handleContractDelete = (index: number) =>
    setGame(removeContract(game)(index));
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
  const handleChangeGameProperties = (
    prop: keyof UpdateGameProps,
    value: any
  ) => {
    if (prop === "partyScoreType") {
      const contract = isPartyLike(value)
        ? createContract({
            bidType: BID_TYPE.PARTY,
            taker: PLAYER_TYPE.DECLARER,
          })
        : createContract({
            bidType: BID_TYPE.KLOPICZKY,
            taker: PLAYER_TYPE.DECLARER,
          });
      const updated = flow(
        removeAllContract,
        addContractFlipped(contract),
        updateGame({ [prop]: value })
      )(game);
      setGame(updated);
    } else {
      setGame(updateGame({ [prop]: value })(game));
    }
  };
  const handleAddContract = (contract: Contract) => {
    return setGame(flow(createContract, addContract(game))(contract));
  };
  const handleChangeContract = (
    index: number,
    field: keyof Contract,
    value: any
  ) => {
    setGame(
      flow(
        updateContract({ [field]: value }),
        updateGameContract(game)(index)
      )(game.contracts[index])
    );
  };
  const handleSaveGame = () => {
    setGameScoreList([...gameScoreList, getPlayersScores(game)]);
    setGame(createGame());
  };

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
            <GameProperties game={game} onChange={handleChangeGameProperties} />
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
      <Grid item container>
        <Grid item>
          <GameScore game={game} />
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleSaveGame}>
            Save Scores
          </Button>
        </Grid>
      </Grid>
      <Grid item>
        <BidSelector bids={allBids} onAddContract={handleAddContract} />
      </Grid>
      <Grid item>
        <ContractsTable
          contracts={game?.contracts as Contract[]}
          onChange={handleChangeContract}
          onDelete={handleContractDelete}
        />
      </Grid>
      <Grid item>
        <ScoreSheet gameScoreList={gameScoreList} />
      </Grid>
    </Grid>
  );
};

export default TarockSheet;
