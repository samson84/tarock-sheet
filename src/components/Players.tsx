import {
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Card,
  CardHeader,
  Avatar,
  CardContent,
  makeStyles,
  Typography as T,
  CardActions,
  IconButton,
} from "@material-ui/core";
import React, { useState } from "react";
import { Game } from "../lib/game";
import {
  createPlayer,
  getPlayerTypeColor,
  Player,
  PlayerList,
  PLAYER_TYPE,
  rotatePlayerTypeWithNull,
  updatePlayer,
  updatePlayerAt,
  removePlayer,
  UpdatePlayerProps,
} from "../lib/player";
import { Id } from "../lib/util";
import { MdDelete as RemoveIcon } from "react-icons/md";
import { MdEdit as EditIcon } from "react-icons/md";
import { MdPerson as UserIcon } from "react-icons/md";
import { MdPersonAdd as AddUserIcon } from "react-icons/md";
import { MdDone as FinishEditingIcon } from "react-icons/md";

interface PlayerAvatarProps {
  player: Player;
}
const PlayerAvatar = ({ player }: PlayerAvatarProps) => (
  <Avatar>
    {player.name.length > 0 ? <>{player.name.slice(0, 1)}</> : <UserIcon />}
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
  const handleChange = (prop: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => onChange(updatePlayer({ [prop]: event.target.value })(player));
  const handleNameChange = handleChange("name");
  const handleBaseScoreChange = handleChange("baseScore");
  const color = getPlayerTypeColor(player.type);
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
            <IconButton onClick={handleRemove}>
              <RemoveIcon />
            </IconButton>
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
  const color = getPlayerTypeColor(player.type);
  const playing = player.type !== null;
  const hasCurrentScore = player.currentScore !== null;
  const currentScoreText =
    playing && hasCurrentScore ? ` (${player.currentScore})` : "";
  const score =
    player.score !== null ? player.score + player.baseScore : player.baseScore;
  return (
    <Card>
      <CardHeader
        avatar={<PlayerAvatar player={player} />}
        title={player.name}
        subheader={`${score}${currentScoreText}`}
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
}
const Players = (props: PlayersProps) => {
  const { players, onPlayerListChange, onSaveScores, saveDisabled } = props;
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
      <Grid item container direction="row" alignItems="center">
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
