import React, { ChangeEvent } from "react";
import * as gameModel from "../models/gameModel";
import {
  Grid,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography as T,
} from "@material-ui/core";
import { upperCaseToWords } from "../lib/util";
import MultiplierSelector from "./MultiplierSelector";

const calledTarockOptions = ["_None_", ...Object.keys(gameModel.CALLED_TAROCK)];
const partyScoreOptions = Object.keys(gameModel.PARTY_SCORE);

interface GamePropertiesProps {
  game: gameModel.Game;
  onChange: (property: keyof gameModel.UpdateGameProps, value: any) => void;
}
const GameProperties = (props: GamePropertiesProps) => {
  const { game, onChange } = props;
  return (
    <Grid container spacing={3} alignContent="space-around">
      <Grid item>
        <FormControl component="fieldset">
          <InputLabel id="called-tarock-selector">Called</InputLabel>
          <Select
            value={game.called_tarock || "_None_"}
            onChange={(event: ChangeEvent<{ value: string }>) => {
              onChange("called_tarock", event.target.value);
            }}
            labelId="called-tarock-selector"
          >
            {calledTarockOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option === "_None_" ? "None" : option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl component="fieldset">
          <FormLabel>Party Score</FormLabel>
          <RadioGroup
            row
            value={game.partyScoreType}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onChange(
                "partyScoreType",
                event.target.value as gameModel.PARTY_SCORE_TYPE
              );
            }}
          >
            {partyScoreOptions.map((option: gameModel.PARTY_SCORE_TYPE) => (
              <FormControlLabel
                key={option}
                value={option}
                control={<Radio color="default" />}
                label={upperCaseToWords(option)}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item>
        <T variant="caption" display="block" color="textSecondary">
          Party Base Score
        </T>
        <MultiplierSelector
          value={game.partyBaseScore}
          onChange={(score) => {
            onChange("partyBaseScore", score);
          }}
        />
      </Grid>
    </Grid>
  );
};

export default GameProperties;
