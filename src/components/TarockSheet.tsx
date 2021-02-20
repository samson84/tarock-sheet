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
  PARTY_SCORE_TYPE,
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
  resetPlayerScore,
} from "../lib/player";
import {
  assignScoresToPlayers,
  getCurrentScoreForPlayers,
  isReadyForSave,
  sumPlayerScores,
} from "../lib/gameScoreList";
import { storage as storageInitializer } from "../services/localStorage";
import Confirm from "./Confirm";

const allBidsByGroup = getAllBidsByGorup();
const storage = storageInitializer();

const TarockSheet = () => {
  const [game, setGame] = useState<Game>(
    (storage.read("game") as Game | null) ?? createGame()
  );
  const [players, setPlayers] = useState<Player[]>(
    (storage.read("players") as Player[] | null) ?? []
  );
  const [gameScoreList, setGameScoreList] = useState<PlayerListObject[]>(
    (storage.read("gameScoreList") as PlayerListObject[] | null) ?? []
  );

  useEffect(() => {
    setPlayers(getCurrentScoreForPlayers(game));
  }, [game]);

  useEffect(() => {
    if (!storage.isSupported()) {
      return;
    }
    try {
      storage.update("game", game as object);
      storage.update("players", players);
      storage.update("gameScoreList", gameScoreList);
    } catch (error) {
      console.error(error);
    }
  }, [game, players, gameScoreList]);

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
    setGame((prevGame) => {
      const partyScoreTypeChanged = prop === "partyScoreType";
      const fromKlopiczkyToPartyLikeChanged =
        prevGame.partyScoreType === PARTY_SCORE_TYPE.KLOPICZKY &&
        isPartyLike(value);
      const fromPartyLikeToKlopiczkyChanged =
        isPartyLike(prevGame.partyScoreType) &&
        value === PARTY_SCORE_TYPE.KLOPICZKY;
      const fromNullToKlopiczkyChanged =
        prevGame.partyScoreType === null &&
        value === PARTY_SCORE_TYPE.KLOPICZKY;
      const partyLikeAndEmptyContracts =
        isPartyLike(value) && prevGame.contracts.length === 0;
      const shouldRemoveContracts =
        partyScoreTypeChanged &&
        (fromKlopiczkyToPartyLikeChanged ||
          fromPartyLikeToKlopiczkyChanged ||
          fromNullToKlopiczkyChanged ||
          partyLikeAndEmptyContracts);
      if (shouldRemoveContracts) {
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
        return updated;
      } else {
        return updateGame({ [prop]: value })(game);
      }
    });
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
  const handleResetPlayers = () => {
    setGame(createGame());
    updateGameScoreListState([]);
    updatePlayersState([]);
  };
  const handleResetScores = () => {
    updateGameScoreListState([]);
    flow(resetPlayerScore, clearPlayersType, updatePlayersState)(players);
  };

  const partyScoreTypeSelected = game.partyScoreType !== null;

  return (
    <Grid container spacing={3} direction="column">
      <Grid item>
        <Players
          players={players}
          onPlayerListChange={handlePlayerListChange}
          onSaveScores={handleSaveScores}
          saveDisabled={!isReadyForSave(players)(game)}
          onResetPlayers={handleResetPlayers}
          onResetScores={handleResetScores}
        />
      </Grid>
      <Grid item>
        <Grid item container spacing={1} direction="row">
          <Grid item>
            <GameProperties game={game} onChange={handleChangeGameProperties} />
          </Grid>
          <Grid item>
            <Confirm
              title="Do you really want to reset this Game?"
              text="It will clear up the game's properties and remove all contracts without saving them, but keep the players' scores."
              target={(handleClick) => (
                <Button variant="outlined" onClick={handleClick}>
                  Reset Game
                </Button>
              )}
              onConfirm={handleResetGame}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        {partyScoreTypeSelected && (
          <ContractSelector
            key={
              game.partyScoreType === null ? 1 : 0
            } /* Resets the internal state if the game is reseted */
            bidsByGroup={allBidsByGroup}
            onAddContract={handleAddContract}
          />
        )}
      </Grid>
      <Grid item>
        {partyScoreTypeSelected && (
          <ContractsTable
            contracts={game?.contracts as Contract[]}
            onChange={handleChangeContract}
            onDelete={handleContractDelete}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default TarockSheet;
