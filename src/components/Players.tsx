import {
  Button,
  TextField,
  Grid,
  Card,
  CardHeader,
  Avatar,
  CardContent,
  CardActions,
  IconButton,
} from "@material-ui/core";
import React, { useState } from "react";
import {
  createPlayer,
  getPlayerTypeColor,
  Player,
  PlayerList,
  rotatePlayerTypeWithNull,
  updatePlayer,
  updatePlayerAt,
  removePlayer,
} from "../models/playerModel";
import { MdDelete as RemoveIcon } from "react-icons/md";
import { MdEdit as EditIcon } from "react-icons/md";
import { MdPerson as UserIcon } from "react-icons/md";
import { MdPersonAdd as AddUserIcon } from "react-icons/md";
import { MdDone as FinishEditingIcon } from "react-icons/md";
import WinnerIcon from "@material-ui/icons/EmojiEvents";
import Confrim from "./Confirm";

interface PlayerAvatarProps {
  player: Player;
}
const PlayerAvatar = ({ player }: PlayerAvatarProps) => (
  <Avatar>
    {player.name.length > 0 ? <>{player.name.slice(0, 2)}</> : <UserIcon />}
  </Avatar>
);

interface EditablePlayerItemProps {
  player: Player;
  onRemove: (player: Player) => void;
  onChange: (updated: Player) => void;
}
const EditablePlayerItem = (props: EditablePlayerItemProps) => {
  const { player, onRemove, onChange } = props;
  const handleRemove = () => onRemove(player);
  const handleChange = (prop: string) => (value: any) => {
    onChange(updatePlayer({ [prop]: value })(player));
  };
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange("name")(event.target.value);
  };
  const handleBaseScoreChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    handleChange("baseScore")(value.length > 0 ? Number(value) : null);
  };
  return (
    <Card>
      <CardContent>
        <Grid container direction="row" spacing={2}>
          <Grid item>
            <PlayerAvatar player={player} />
          </Grid>
          <Grid container item direction="column" xs spacing={2}>
            <Grid item>
              <TextField
                id={`${player.id}_name`}
                label="Name"
                value={player.name}
                onChange={handleNameChange}
              />
            </Grid>
            <Grid item>
              <TextField
                id={`${player.id}_baseScore`}
                label="Base Score"
                type="number"
                value={player.baseScore}
                onChange={handleBaseScoreChange}
              />
            </Grid>
          </Grid>
          <Grid item>
            <Confrim
              title={`Do you want to remove ${player.name || "this player"}?`}
              text="It will remove the player, and deletes its score too."
              target={(handleClick) => (
                <IconButton onClick={handleClick}>
                  <RemoveIcon />
                </IconButton>
              )}
              onConfirm={handleRemove}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

interface PlayerItemProps {
  player: Player;
  onChange: (updated: Player) => void;
}
const PlayerItem = ({ player, onChange }: PlayerItemProps) => {
  const handleChange = () => {
    onChange(
      updatePlayer({ type: rotatePlayerTypeWithNull(player.type) })(player)
    );
  };
  const GAME_WINNER_SCORE = 180;
  const color = getPlayerTypeColor(player.type);
  const playing = player.type !== null;
  const hasGameScore = player.gameScore !== null;
  const gameScoreText = playing && hasGameScore ? ` (${player.gameScore})` : "";
  const score =
    player.sessionScore !== null
      ? player.sessionScore + player.baseScore
      : player.baseScore;
  const isWinner = score > GAME_WINNER_SCORE;
  return (
    <Card>
      <CardHeader
        avatar={<PlayerAvatar player={player} />}
        title={player.name}
        subheader={
          <span>
            {isWinner && <WinnerIcon fontSize="small" color="action" />}
            {`${score}${gameScoreText}`}
          </span>
        }
      />
      <CardActions>
        <Button variant="outlined" color={color} onClick={handleChange}>
          {player.type || "Not playing"}
        </Button>
      </CardActions>
    </Card>
  );
};

interface PlayersProps {
  players: Player[];
  onPlayerListChange: (playerList: PlayerList) => void;
  onSaveScores: () => void;
  saveDisabled: boolean;
  onResetPlayers: () => void;
  onResetScores: () => void;
}
const Players = (props: PlayersProps) => {
  const {
    players,
    onPlayerListChange,
    onSaveScores,
    saveDisabled,
    onResetPlayers,
    onResetScores,
  } = props;
  const [edit, setEdit] = useState(false);

  const handleToogleEdit = () => setEdit((prev) => !prev);
  const handleAdd = () => {
    onPlayerListChange([...players, createPlayer()]);
  };
  const handleRemove = (player: Player) => {
    onPlayerListChange(removePlayer(player)(players));
  };
  const handleChange = (updated: Player) => {
    onPlayerListChange(updatePlayerAt(updated)(players));
  };

  return (
    <Grid container spacing={1}>
      <Grid item container direction="row" alignItems="center" spacing={1}>
        <Grid item>
          <IconButton onClick={handleAdd} title="Add new player">
            <AddUserIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton
            onClick={handleToogleEdit}
            title={edit ? "Finish editing" : "Edit user properties"}
          >
            {edit ? <FinishEditingIcon /> : <EditIcon />}
          </IconButton>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            disabled={saveDisabled}
            onClick={onSaveScores}
          >
            Save scores
          </Button>
        </Grid>
        <Grid item>
          <Confrim
            title="Do you want to reset the Players?"
            text="It will remove all players, and also delete their scores."
            target={(handleClick) => (
              <Button variant="outlined" onClick={handleClick}>
                Reset Players
              </Button>
            )}
            onConfirm={onResetPlayers}
          />
        </Grid>
        <Grid item>
          <Confrim
            title="Do you want to reset the Scores?"
            text="It will reset the scores to the players' base score, but keeps all the players."
            target={(handleClick) => (
              <Button variant="outlined" onClick={handleClick}>
                Reset Scores
              </Button>
            )}
            onConfirm={onResetScores}
          />
        </Grid>
      </Grid>
      {players.map((player) => (
        <Grid item xs={edit ? 3 : false}>
          {edit ? (
            <EditablePlayerItem
              key={player.id}
              onChange={handleChange}
              onRemove={handleRemove}
              player={player}
            />
          ) : (
            <PlayerItem
              key={player.id}
              player={player}
              onChange={handleChange}
            />
          )}
        </Grid>
      ))}
    </Grid>
  );
};

export default Players;
