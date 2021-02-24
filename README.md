# Tarock Sheet

An awesome app to help track a Tarock game scores.

## Roadmap

- [.] Milesteone 1 - Local storage, correct scores, Player handling,UI improvements
  - [.] refactor
    - [.] rename the components and methods
      - [x] create a models dir, place the models into this dir
      - [x] game to gameModel
        - [x] rename game to gameModel, move it to models folder
        - [x] scores prop to playerTypeScores
        - [x] createGame: create
        - [x] updateGame: update
        - [x] updateGameWithScores: updateWithPlayerTypeScores
        - [x] removeContract: removeContractAt
        - [x] removeAllContract: removeAllContracts
        - [x] updateGameContract: updateContractAt
        - [x] calculateGame: calculatePlayerTypeScore
        - [x] refactor game imports
      - [x] contract to contractModel
        - [x] rename and move contract to contractModel
        - [x] silent prop: isSilent
        - [x] winByTaker prop: isWonByTaker
        - [x] validateContract: validate
        - [x] createContract: create
        - [x] updateContract: update
        - [x] calculateContract: calculateContractScore
        - [x] remove unused functions: withIndices, filterByPartyLike, filterByProps
        - [x] refactor contractModel imports to namespace imports
        - [x] ContractScore --> PlayerScore
      - [x] player: playerModel
        - [x] rename and move
        - [x] score prop: sessionScore
        - [x] currentScore prop: gameScore
        - [x] PlayerScore: Score
        - [x] createPlayer: create
        - [x] updatePlayer: update
        - [x] getAnotherPlaterType: getOppositeType
        - [x] getPlayerTypeColor: getTypeColor
        - [x] rotatePlayerTypeWithNull: rotateTypeWithNull
        - [x] refactor to namespace imports
      - [x] playerListModel
        - [x] create and move functions
        - [x] playerModel.addPlayer: add
        - [x] playerModel.removePlayer: remove
        - [x] playerModel.updatePlayerAt: update
        - [x] getPlayerNumberByType: countByType
        - [x] clearPlayersType: clearType
        - [x] resetPlayerScore: clearSessionScore
        - [x] filterPlayersInGame: filterByInGame
        - [x] createPlayerListObject: mapToObjectById
        - [x] refactor to namespace imports
      - [x] bid: bidModel
        - [x] rename and move
        - [x] silent prop: canSilent
        - [x] winByDefault prop: isWinByDefault
        - [x] notWinIfSilent prop: isNotWinIfSilent
        - [x] denyContra prop: isDenyContra
        - [x] score prop: bidBaseScore
        - [x] BID_TYPE: TYPE
        - [x] BidData: Data
        - [x] BidGroupType: Group
        - [x] bidGroupNamesByWeight: getGroupsOrderedByWeight
        - [x] BidVariant: Variant
        - [x] getBid: getByType
        - [x] getAllBids: getAll
        - [x] getAllBidsByGroup: getAllByGroup
        - [x] getBidScore: calculateScore
        - [x] refactor to namespace imports
        - [x] rename CARD_SHAPE to CARD_SUIT
      - [x] gameScoreList: GameSession
        - [x] rename and move
        - [x] getScore: calculateScoreByPlayerType
        - [x] getCurrentScoreForPlayer: mapGameScoreToPlayers
        - [x] sumPlayerScores: calculateGameSessionScores
        - [x] PlayerScores: GameSessionScore
        - [x] assignScoresToPlayers: mapGameSessionScoresToPlayers
        - [x] refactor namespace imports
      - [x] move fixtures to models
        - [x] move
        - [x] rename fixtures
      - [x] rename game props to camelCase, party_score, called_tarock
      - [x] Contract.bidBaseScore to contractBaseScore
      - [x] rename types and remaining models for shorter names
        - [x] Contract
        - [x] Game
        - [x] PlayerList
        - [x] Player
        - [x] Score
          - [x] rename scoreModel in imports
    - [ ] Tarock sheet: move handler's logic to data layer, if possible
    - [ ] contract better calculation of the bid base score
    - [ ] game, contract: simplify create and update methods with same parameter set
    - [ ] refactor can silent, do not leak bids details to contract layer
      - [ ] Add canSilent method to contract too.
      - [ ] refactor ContractsTable to use the new can silent contracts.      
    - [ ] add license, contribution, proper readme
    - [ ] increase test coverage
    - [ ] also clear the base scores too when resetting the scores
    - [ ] correct missing key prop in Players.tsx
- [ ] Milestone 2, store in a permanent storage, share a game
  - [ ] add validators and defaults to models
  - [ ] implement error handling and showing to the user
  - [ ] Set and save the mayor state
  - [ ] Save the DateTime to the Game
  - [ ] save the details of the previous games
    [ ] add random colors to player avatars
  - [ ] do some authentication / login / firebase
  - [ ] save the game to a DB e.g. Firebase
  - [ ] deploy the app to heroku / netlify / vercel / Firebase
  - [ ] share the game with others
  - [ ] Sign which player is the mayor in player list, sign it in scores too.
- [ ] Milestone 3, mobile friendly, UX improvements
  - [ ] add UI tests
  - [ ] refactor
    - [ ] TarockSheet extract a Game component from the tarock sheet
    - [ ] split contractSelector to smaller components
    - [ ] split ContractsTable to smaller components
  - [ ] refactor
    - [ ] better type checking for dynamic types in Contracts table
  - [ ] usability
    - [ ] Add default players if empty
    - [ ] Game Properties: show score near the game score selector radio buttons
    - [ ] BidSelector: show the score near the bids

  - [ ] compact Contract Table
    - [ ] collapse fields
    - [ ] compact view
    - [ ] row styling based on validInFinalScore
    - [ ] Tarock sheet: better Win by taker UI component, e.g: a button
    - [ ] show the declarers and opponents scores around the contract table
    - [ ] ContractsTable: show the the contra names instead of the values
    - [ ] ContractsTable: integrate bid variant into the bid column
    - [ ] Variant selector: show icons near the variants
      - [ ] Contracts Table: show variants icons'
  - [ ] responsive design check

- [ ] Milestone 4, better game saving and history
  - [ ] show each game scroes as a table (collapsable)
  - [ ] save multiple nights
  - [ ] edit the previous games scores
  - [ ] add undo & redo (?)
  - [ ] add hotkeys
- [ ] Milestone 5
  - [ ] customizing the bids, create general rules
  - [ ] multilanguage
- [x] Done
  - [.] Milestone 1
    - [x] create a better app icon and align the icon in the app bar
      - [x] add a better favicon
      - [x] add a better logo for manifest
    - [x] add confirmations to destroy / reset type of actions
    - [x] do not delete the contracts, if the previous party score type was party or contracts are already added
    - [x] show the contracts and the selector only if, the party is selected
    - [x] Indicate Game winner (Radli) on players
    - [x] ContractTable: when a contract silent, show visually that the contra does not take into account.
    - [x] ContractTable: if a contract is silent, it should not able to apply a contra on it,
    - [x] correct pheasants' score to 20
    - [x] save the games locally and clear logic
    - [x] generalize button colors and variants
    - [x] rename BidSelector to ContractSelector
    - [x] correct scores: king uhu 20, centrum 10, small bird 10, large bird 10
    - [x] save only the scores if they are available
    - [x] Better player and scores handling, create one component
    - [x] correct klopiczky and self calling calulation
    - [x] correct new contracts added as loose by taker instead of unknown
    - [x] add a party base score
    - [x] add title for the app, fill metadata in manifest.json + index.html
    - [x] switch off the silent and win, if the party is reset-ed
    - [x] save the scores only if the proper number of players selected
    - [x] when klopitzky game ticked, add klopiczky contract, remove others
    - [x] when party game ticked add party automatically 
    - [x] refactor game handling: remove validation rules, and validInFinalScore props, use winByTaker null instead and make it manually
    - [x] handle multiple games, score sheet
    - [x] Faster bid adding
      - [x] group the bids
      - [x] disable the dialog when adding: add contracts default by taker, null variant, it can be changed in the contracts table
      - [x] make a global silent switch, it adds bids silently, and automatically win, except ulti
      - [x] ContractsTable: automatically won by the eight and nine tarock, klopiczky
    - [x] disable contra for eight, nine tarock
  - [x] MVP
    - [x] Add player handling
    - [x] Calculate score
    - [x] ContractsTable, actions
    - [x] TarockSheet: Add game properties
    - [x] Recalculate scores, when a party type changes
    - [x] Deploy to github pages, w github actions
