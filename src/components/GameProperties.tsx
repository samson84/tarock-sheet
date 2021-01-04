import React, { ChangeEvent } from "react";
import {
  CALLED_TAROCK,
  Game,
  UpdateGameProps,
  PARTY_SCORE,
  PARTY_SCORE_TYPE,
} from "../lib/game";
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
} from "@material-ui/core";
import { upperCaseToWords } from "../lib/util";

const calledTarockOptions = ["_None_", ...Object.keys(CALLED_TAROCK)];
const partyScoreOptions = Object.keys(PARTY_SCORE);

interface GamePropertiesProps {
  game: Game;
  onChange: (property: keyof UpdateGameProps, value: any) => void;
}
const GameProperties = (props: GamePropertiesProps) => {
  const { game, onChange } = props;
  return (
    <Grid container spacing={3} alignContent="space-around">
      <Grid item>
        <FormControl>
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
          <FormLabel component="legend">Party Score</FormLabel>
          <RadioGroup
            row
            value={game.partyScoreType}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onChange(
                "partyScoreType",
                event.target.value as PARTY_SCORE_TYPE
              );
            }}
          >
            {partyScoreOptions.map((option: PARTY_SCORE_TYPE) => (
              <FormControlLabel
                key={option}
                value={option}
                control={<Radio />}
                label={upperCaseToWords(option)}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default GameProperties;
