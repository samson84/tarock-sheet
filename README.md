# TODO
- [.] Milesteone 1
  - [x] correct klopiczky and self calling calulation
  - [x] correct new contracts added as loose by taker instead of unknown
  - [x] add a party base score
  - [ ] do not delete the contracts, if the previous party score type was party / show the contracts only if, the party is selected
  - [ ] add starter scores to the players
  - [x] add title for the app, fill metadata in manifest.json + index.html
  - [ ] switch off the silent and win, if the party is reset-ed
  - [ ] add clear scores, do not clear the players
  - [ ] save the games locally
  - [x] save the scores only if the proper number of players selected
  - [ ] usability
    - [ ] new contracts on the top of the ContractsTable
    - [x] ContractTable: when a contract silent, show visually that the contra does not take into account.
    - [x] ContractTable: if a contract is silent, it should not able to apply a contra on it, 
    - [ ] Game Properties: show score near the game score selector radio buttons
    - [ ] BidSelector: show the score near the bids
    - [ ] ContractsTable: show the the contra names instead of the values
    - [ ] ContractsTable: integrate bid variant into the bid column
    - [ ] add confirmation to new game
  - [ ] Save the DateTime to the Game
  - [ ] Better player and scores handling, create one component
  - [ ] refactor
    - [ ] contract better calculation of the bid base score
    - [ ] game, contract: simplify create and update methods with same parameter set
    - [ ] BidSelector: Refactor Modal to Dialog
    - [ ] refactor can silent, do not leak bids details to contract layer
      - [ ] Add canSilent method to contract too.
      - [ ] refactor ContractsTable to use the new can silent contracts.      
    - [x] rename BidSelector to ContractSelector
    - [ ] rename TarockSheet to Game component
    - [ ] rename game props to camelCase, party_score, called_tarock
- [ ] Milestone 2
  - [ ] do some authentication / login / firebase
  - [ ] save the game to a DB e.g. Firebase
  - [ ] deploy the app to heroku / netlify / vercel / Firebase
  - [ ] share the game with others
  - [ ] refactor
    - [ ] create a better app icon
    - [ ] align the icon in the app bar
    - [ ] split bidselector to smaller components
    - [ ] split ContractsTable to smaller components
- [ ] Milestone 3
  - [ ] compact Contract Table
    - [ ] collapse fields
    - [ ] comapct view
    - [ ] row styling based on validInFinalScore
  - [ ] add undo & redo (?)
  - [ ] responsive design check
  - [ ] add license, contribution, proper readme
  - [ ] add hotkeys
- [x] Done
  - [.] Milestone 1
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
