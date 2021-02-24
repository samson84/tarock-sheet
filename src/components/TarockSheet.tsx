import React, { useEffect, useState } from "react";
import * as Bid from "../models/Bid";
import ContractSelector from "./ContractSelector";
import * as Game from "../models/Game";
import * as Contract from "../models/Contract";
import { Button, Grid } from "@material-ui/core";
import ContractsTable from "./ContractsTable";
import GameProperties from "./GameProperties";
import flow from "lodash/fp/flow";
import concat from "lodash/fp/concat";
import Players from "./Players";
import * as playerModel from "../models/playerModel";
import * as PlayerList from "../models/PlayerList";
import * as GameSession from "../models/GameSession";
import { storage as storageInitializer } from "../services/localStorage";
import Confirm from "./Confirm";

const allBidsByGroup = Bid.getAllByGroup();
const storage = storageInitializer();

const TarockSheet = () => {
  const [game, setGame] = useState<Game.Props>(
    (storage.read("game") as Game.Props | null) ?? Game.create()
  );
  const [players, setPlayers] = useState<playerModel.Player[]>(
    (storage.read("players") as playerModel.Player[] | null) ?? []
  );
  const [gameScoreList, setGameScoreList] = useState<PlayerList.PlayerMap[]>(
    (storage.read("gameScoreList") as PlayerList.PlayerMap[] | null) ?? []
  );

  useEffect(() => {
    setPlayers(GameSession.mapGameScoreToPlayers(game));
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
    setGame(Game.removeContractAt(game)(index));
  const handleResetGame = () => setGame(Game.create());
  const handlePlayerListChange = (playerList: PlayerList.Props) => {
    updatePlayersState(playerList);
  };
  const handleChangeGameProperties = (
    prop: keyof Game.UpdateProps,
    value: any
  ) => {
    setGame((prevGame) => {
      const partyScoreTypeChanged = prop === "partyScoreType";
      const fromKlopiczkyToPartyLikeChanged =
        prevGame.partyScoreType === Game.PARTY_SCORE_TYPE.KLOPICZKY &&
        Game.isPartyLike(value);
      const fromPartyLikeToKlopiczkyChanged =
        Game.isPartyLike(prevGame.partyScoreType) &&
        value === Game.PARTY_SCORE_TYPE.KLOPICZKY;
      const fromNullToKlopiczkyChanged =
        prevGame.partyScoreType === null &&
        value === Game.PARTY_SCORE_TYPE.KLOPICZKY;
      const partyLikeAndEmptyContracts =
        Game.isPartyLike(value) && prevGame.contracts.length === 0;
      const shouldRemoveContracts =
        partyScoreTypeChanged &&
        (fromKlopiczkyToPartyLikeChanged ||
          fromPartyLikeToKlopiczkyChanged ||
          fromNullToKlopiczkyChanged ||
          partyLikeAndEmptyContracts);
      if (shouldRemoveContracts) {
        const contract = Game.isPartyLike(value)
          ? Contract.create({
              bidType: Bid.TYPE.PARTY,
              taker: playerModel.PLAYER_TYPE.DECLARER,
            })
          : Contract.create({
              bidType: Bid.TYPE.KLOPICZKY,
              taker: playerModel.PLAYER_TYPE.DECLARER,
              isWonByTaker: true,
            });
        const updated = flow(
          Game.removeAllContracts,
          Game.addContractFlipped(contract),
          Game.update({ [prop]: value })
        )(game);
        return updated;
      } else {
        return Game.update({ [prop]: value })(game);
      }
    });
  };
  const handleAddContract = (contract: Contract.Props) => {
    return setGame(flow(Contract.create, Game.addContract(game))(contract));
  };
  const handleChangeContract = (
    index: number,
    field: keyof Contract.Props,
    value: any
  ) => {
    setGame(
      flow(
        Contract.update({ [field]: value }),
        Game.updateGameContractAt(game)(index)
      )(game.contracts[index])
    );
  };
  const handleSaveScores = () => {
    const updatedGameScoreList = flow(
      PlayerList.filterByInGame,
      PlayerList.mapToObjectById,
      concat(gameScoreList)
    )(players);
    updateGameScoreListState(updatedGameScoreList);
  };
  const updatePlayersState = (updated: PlayerList.Props) => {
    flow(GameSession.mapGameScoreToPlayers(game), setPlayers)(updated);
  };
  const updateGameScoreListState = (updated: PlayerList.PlayerMap[]) => {
    flow(
      GameSession.calculateGameSessionScores,
      GameSession.mapGameSessionScoresToPlayers(players),
      PlayerList.clearType,
      updatePlayersState
    )(updated);
    setGameScoreList(updated);
    setGame(Game.create());
  };
  const handleResetPlayers = () => {
    setGame(Game.create());
    updateGameScoreListState([]);
    updatePlayersState([]);
  };
  const handleResetScores = () => {
    updateGameScoreListState([]);
    flow(
      PlayerList.clearSessionScore,
      PlayerList.clearType,
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
          saveDisabled={!GameSession.isReadyForSave(players)(game)}
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
            contracts={game?.contracts as Contract.Props[]}
            onChange={handleChangeContract}
            onDelete={handleContractDelete}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default TarockSheet;
