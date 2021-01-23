import {
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
} from "@material-ui/core";
import React, { useState } from "react";
import { Game } from "../lib/game";
import {
  createPlayerList,
  getPlayerTypeColor,
  Player,
  PLAYER_TYPE,
  rotatePlayerTypeWithNull,
} from "../lib/player";

interface PlayerItemProps {
  player: Player;
  playerType: PLAYER_TYPE | null;
  onRemove: (player: Player) => void;
  onChange: (player: Player, playerType: PLAYER_TYPE | null) => void;
}
const PlayerItem = (props: PlayerItemProps) => {
  const { player, playerType, onRemove, onChange } = props;
  const handleRemove = () => onRemove(player);
  const handleChange = () =>
    onChange(player, rotatePlayerTypeWithNull(playerType));
  const color = getPlayerTypeColor(playerType);
  return (
    <>
      <Chip
        color={color}
        label={player}
        variant="default"
        onDelete={handleRemove}
        onClick={handleChange}
      />
    </>
  );
};

interface AddPlayerDialogProps {
  open: boolean;
  onAdd: (player: Player) => void;
  onClose: () => void;
}
const AddPlayerDialog = ({ open, onAdd, onClose }: AddPlayerDialogProps) => {
  const [player, setPlayer] = useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlayer(event.target.value);
  };
  const handleClose = () => {
    setPlayer("");
    onClose();
  };
  const handleAdd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onAdd(player);
    setPlayer("");
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Player</DialogTitle>
      <DialogContent>
        <form onSubmit={handleAdd} >
        <TextField
          autoFocus
          margin="dense"
          label="Player Name"
          value={player}
          onChange={handleChange}
        />
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface PlayersProps {
  players: Player[];
  game: Game;
  onPlayerAdd: (player: Player) => void;
  onPlayerRemove: (player: Player) => void;
  onPlayerChange: (player: Player, playerType: PLAYER_TYPE | null) => void;
}
const Players = (props: PlayersProps) => {
  const { players, onPlayerAdd, onPlayerChange, onPlayerRemove, game } = props;
  const [open, setOpen] = useState<boolean>(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => setOpen(true);
  const handlePlayerAdd = (player: Player) => {
    setOpen(false);
    onPlayerAdd(player);
  };
  const playerList = createPlayerList(players, game.declarers, game.opponents);
  return (
    <Grid container spacing={3}>
      <AddPlayerDialog
        open={open}
        onAdd={handlePlayerAdd}
        onClose={handleClose}
      />
      <Grid item>
        <Button variant="contained" onClick={handleOpen}>
          Add Player
        </Button>
      </Grid>
      <Grid item>
        {playerList.map(({ player, playerType }) => (
          <PlayerItem
            key={player}
            onChange={onPlayerChange}
            onRemove={onPlayerRemove}
            player={player}
            playerType={playerType}
          />
        ))}
      </Grid>
    </Grid>
  );
};

export default Players;
