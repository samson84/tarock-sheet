import { Contract } from "./contract";
import { Player, PLAYER_TYPE } from "./player";


interface Game {
  contracts: Contract[];
  declarers: Player[];
  opponents: Player[];
  party_score: null | number;
}

export const createGame = (): Game => ({
  contracts: [],
  declarers: [],
  opponents: [],
  party_score: null,
});

export const addPlayer = (player: Player, type: PLAYER_TYPE) => (
  game: Game
): Game => {
  const key = type === PLAYER_TYPE.DECLARER ? "declarers" : "opponents";

  const otherKey = type === PLAYER_TYPE.OPPONENT ? "declarers" : "opponents";

  if (game[key].includes(player)) {
    return { ...game };
  }

  return {
    ...game,
    [key]: [...game[key], player],
    [otherKey]: game[otherKey].filter((p) => p !== player),
  };
};

export const removePlayer = (player: Player) => (game: Game): Game => ({
  ...game,
  opponents: game.opponents.filter((p) => p !== player),
  declarers: game.declarers.filter((p) => p !== player),
});

export const addContract = (contract: Contract) => (game: Game) => ({
  ...game,
  contracts: [...game.contracts, contract]
})

