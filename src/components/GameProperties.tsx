import React, { ChangeEvent, useState } from "react";
import {
  CALLED_TAROCK,
  Game,
  UpdateGameProps,
  PARTY_SCORE,
  PartyScoreType,
  PartyScoreValue,
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
  const [calledTarock, setCalledTarock] = useState(
    game.called_tarock || "_None_"
  );
  const [partyScore, setPartyScore] = useState(game.party_score);

  return (
    <Grid container spacing={3} alignContent="space-around">
      <Grid item>
        <FormControl>
          <InputLabel id="called-tarock-selector">Called</InputLabel>
          <Select
            value={calledTarock}
            onChange={(event: ChangeEvent<{ value: string }>) => {
              setCalledTarock(event.target.value);
              event.target.value === "_None_"
                ? onChange("called_tarock", null)
                : onChange("called_tarock", event.target.value);
            }}
            labelId="called-tarock-selector"
          >
            {calledTarockOptions.map((option) =>
              option === "_None_" ? (
                <MenuItem key={option} value={option}>None</MenuItem>
              ) : (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              )
            )}
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl component="fieldset">
          <FormLabel component="legend">Party Score</FormLabel>
          <RadioGroup
            row
            value={partyScore}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setPartyScore(Number(event.target.value) as PartyScoreValue);
              onChange("party_score", Number(event.target.value) as PartyScoreValue)
            }}
          >
            {partyScoreOptions.map((option: PartyScoreType) => (
              <FormControlLabel
                key={option}
                value={PARTY_SCORE[option]}
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
