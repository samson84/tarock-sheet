import React, { useEffect, useState } from "react";
import * as Bid from "../models/Bid";
import ContractSelector from "./ContractSelector";
import * as gameModel from "../models/gameModel";
import * as contractModel from "../models/contractModel";
import { Button, Grid } from "@material-ui/core";
import ContractsTable from "./ContractsTable";
import GameProperties from "./GameProperties";
import flow from "lodash/fp/flow";
import concat from "lodash/fp/concat";
import Players from "./Players";
import * as playerModel from "../models/playerModel";
import * as playerListModel from "../models/playerListModel";
import {
  assignScoresToPlayers,
  getCurrentScoreForPlayers,
  isReadyForSave,
  sumPlayerScores,
} from "../lib/gameScoreList";
import { storage as storageInitializer } from "../services/localStorage";
import Confirm from "./Confirm";

const allBidsByGroup = Bid.getAllByGroup();
const storage = storageInitializer();

const TarockSheet = () => {
  const [game, setGame] = useState<gameModel.Game>(
    (storage.read("game") as gameModel.Game | null) ?? gameModel.create()
  );
  const [players, setPlayers] = useState<playerModel.Player[]>(
    (storage.read("players") as playerModel.Player[] | null) ?? []
  );
  const [gameScoreList, setGameScoreList] = useState<
    playerListModel.PlayerListObject[]
  >(
    (storage.read("gameScoreList") as
      | playerListModel.PlayerListObject[]
      | null) ?? []
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
    setGame(gameModel.removeContractAt(game)(index));
  const handleResetGame = () => setGame(gameModel.create());
  const handlePlayerListChange = (playerList: playerListModel.PlayerList) => {
    updatePlayersState(playerList);
  };
  const handleChangeGameProperties = (
    prop: keyof gameModel.UpdateGameProps,
    value: any
  ) => {
    setGame((prevGame) => {
      const partyScoreTypeChanged = prop === "partyScoreType";
      const fromKlopiczkyToPartyLikeChanged =
        prevGame.partyScoreType === gameModel.PARTY_SCORE_TYPE.KLOPICZKY &&
        gameModel.isPartyLike(value);
      const fromPartyLikeToKlopiczkyChanged =
        gameModel.isPartyLike(prevGame.partyScoreType) &&
        value === gameModel.PARTY_SCORE_TYPE.KLOPICZKY;
      const fromNullToKlopiczkyChanged =
        prevGame.partyScoreType === null &&
        value === gameModel.PARTY_SCORE_TYPE.KLOPICZKY;
      const partyLikeAndEmptyContracts =
        gameModel.isPartyLike(value) && prevGame.contracts.length === 0;
      const shouldRemoveContracts =
        partyScoreTypeChanged &&
        (fromKlopiczkyToPartyLikeChanged ||
          fromPartyLikeToKlopiczkyChanged ||
          fromNullToKlopiczkyChanged ||
          partyLikeAndEmptyContracts);
      if (shouldRemoveContracts) {
        const contract = gameModel.isPartyLike(value)
          ? contractModel.create({
              bidType: Bid.TYPE.PARTY,
              taker: playerModel.PLAYER_TYPE.DECLARER,
            })
          : contractModel.create({
              bidType: Bid.TYPE.KLOPICZKY,
              taker: playerModel.PLAYER_TYPE.DECLARER,
              isWonByTaker: true,
            });
        const updated = flow(
          gameModel.removeAllContracts,
          gameModel.addContractFlipped(contract),
          gameModel.update({ [prop]: value })
        )(game);
        return updated;
      } else {
        return gameModel.update({ [prop]: value })(game);
      }
    });
  };
  const handleAddContract = (contract: contractModel.Contract) => {
    return setGame(
      flow(contractModel.create, gameModel.addContract(game))(contract)
    );
  };
  const handleChangeContract = (
    index: number,
    field: keyof contractModel.Contract,
    value: any
  ) => {
    setGame(
      flow(
        contractModel.update({ [field]: value }),
        gameModel.updateGameContractAt(game)(index)
      )(game.contracts[index])
    );
  };
  const handleSaveScores = () => {
    const updatedGameScoreList = flow(
      playerListModel.filterByInGame,
      playerListModel.mapToObjectById,
      concat(gameScoreList)
    )(players);
    updateGameScoreListState(updatedGameScoreList);
  };
  const updatePlayersState = (updated: playerListModel.PlayerList) => {
    flow(getCurrentScoreForPlayers(game), setPlayers)(updated);
  };
  const updateGameScoreListState = (
    updated: playerListModel.PlayerListObject[]
  ) => {
    flow(
      sumPlayerScores,
      assignScoresToPlayers(players),
      playerListModel.clearType,
      updatePlayersState
    )(updated);
    setGameScoreList(updated);
    setGame(gameModel.create());
  };
  const handleResetPlayers = () => {
    setGame(gameModel.create());
    updateGameScoreListState([]);
    updatePlayersState([]);
  };
  const handleResetScores = () => {
    updateGameScoreListState([]);
    flow(
      playerListModel.clearSessionScore,
      playerListModel.clearType,
      updatePlayersState
    )(players);
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
            contracts={game?.contracts as contractModel.Contract[]}
            onChange={handleChangeContract}
            onDelete={handleContractDelete}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default TarockSheet;
