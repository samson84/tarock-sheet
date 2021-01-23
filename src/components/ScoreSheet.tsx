import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import React from "react";
import {
  addBaseScore,
  GameScorePerPlayer,
  getAllPlayers,
  sumPlayerScores,
} from "../lib/gameList";

const BASE_SCORE = 100;

interface ScoreSheetProps {
  gameScoreList: GameScorePerPlayer[];
}
const ScoreSheet = ({ gameScoreList }: ScoreSheetProps) => {
  const players = getAllPlayers(gameScoreList);
  const sum = addBaseScore(BASE_SCORE)(sumPlayerScores(gameScoreList));

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>No.</TableCell>
            {players.map((player) => (
              <TableCell key={player}>{`${player} (${
                sum[player] === undefined ? "" : sum[player]
              })`}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {gameScoreList.map((scores, index) => (
            <TableRow key={index}>
              <TableCell>{index}</TableCell>
              {players.map((player) => (
                <TableCell key={player}>
                  {scores[player] === undefined ? " " : scores[player]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ScoreSheet;
