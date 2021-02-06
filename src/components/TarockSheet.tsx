import React, { useEffect, useState } from "react";
import { BID_TYPE, getAllBidsByGorup } from "../lib/bid";
import ContractSelector from "./ContractSelector";
import {
  Game,
  createGame,
  addContract,
  updateGame,
  updateGameContract,
  removeContract,
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
import concat from "lodash/fp/concat";
import Players from "./Players";
import {
  clearPlayersType,
  createPlayerListObject,
  filterPlayersInGame,
  Player,
  PlayerList,
  PlayerListObject,
  PLAYER_TYPE,
} from "../lib/player";
import {
  assignScoresToPlayers,
  getCurrentScoreForPlayers,
  isReadyForSave,
  sumPlayerScores,
} from "../lib/gameScoreList";
// import ScoreSheet from "./ScoreSheet";

const allBidsByGroup = getAllBidsByGorup();

const TarockSheet = () => {
  const [game, setGame] = useState<Game>(createGame());
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameScoreList, setGameScoreList] = useState<PlayerListObject[]>([]);

  useEffect(() => {
    setPlayers(getCurrentScoreForPlayers(game));
  }, [game]);

  const handleContractDelete = (index: number) =>
    setGame(removeContract(game)(index));
  const handleResetGame = () => setGame(createGame());
  const handlePlayerListChange = (playerList: PlayerList) => {
    updatePlayersState(playerList);
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
            winByTaker: true,
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
  const handleSaveScores = () => {
    const updatedGameScoreList = flow(
      filterPlayersInGame,
      createPlayerListObject,
      concat(gameScoreList)
    )(players);
    updateGameScoreListState(updatedGameScoreList);
  };
  const updatePlayersState = (updated: PlayerList) => {
    flow(getCurrentScoreForPlayers(game), setPlayers)(updated);
  };
  const updateGameScoreListState = (updated: PlayerListObject[]) => {
    flow(
      sumPlayerScores,
      assignScoresToPlayers(players),
      clearPlayersType,
      updatePlayersState
    )(updated);
    setGameScoreList(updated);
    setGame(createGame());
  };

  return (
    <Grid container spacing={3} direction="column">
      <Grid item>
        <Players
          players={players}
          onPlayerListChange={handlePlayerListChange}
          onSaveScores={handleSaveScores}
          saveDisabled={!isReadyForSave(players)(game)}
        />
      </Grid>
      <Grid item>
        <Grid item container spacing={1} direction="row">
          <Grid item>
            <GameProperties game={game} onChange={handleChangeGameProperties} />
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={handleResetGame}>
              Reset Game
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <ContractSelector
          key={
            game.partyScoreType === null ? 1 : 0
          } /* Resets the internal state if the game is reseted */
          bidsByGroup={allBidsByGroup}
          onAddContract={handleAddContract}
        />
      </Grid>
      <Grid item>
        <ContractsTable
          contracts={game?.contracts as Contract[]}
          onChange={handleChangeContract}
          onDelete={handleContractDelete}
        />
      </Grid>
    </Grid>
  );
};

export default TarockSheet;
