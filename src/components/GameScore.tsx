import React from "react";
import { Game } from "../models/gameModel";
import { Grid, Chip, Typography as T } from "@material-ui/core";
import { PLAYER_TYPE } from "../lib/player";

interface GameScoreProps {
  game: Game;
}
const GameScore = ({ game }: GameScoreProps) => {
  const { scores } = game;
  return (
    <Grid container direction="column">
      <Grid item container alignItems="center" spacing={1}>
        <Grid item>
          <T color="primary" display="inline" variant="h6">
            Declarers:{" "}
          </T>
        </Grid>
        <Grid item>
          {scores[PLAYER_TYPE.DECLARER] !== null ? (
            <Chip
              color="primary"
              size="small"
              variant="outlined"
              label={scores[PLAYER_TYPE.DECLARER]}
            />
          ) : null}
        </Grid>
      </Grid>
      <Grid item container alignItems="center" spacing={1}>
        <Grid item>
          <T color="secondary" display="inline" variant="h6">
            Opponents:{" "}
          </T>
        </Grid>
        <Grid item>
          {scores[PLAYER_TYPE.OPPONENT] !== null ? (
            <Chip
              color="secondary"
              size="small"
              variant="outlined"
              label={scores[PLAYER_TYPE.OPPONENT]}
            />
          ) : null}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GameScore;
