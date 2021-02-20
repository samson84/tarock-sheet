# TODO
- [.] Milesteone 1 - Local storage, correct scores, Player handling,UI improvements
  - [ ] add confirmations to destroy / reset type of actions
  - [x] do not delete the contracts, if the previous party score type was party or contracts are already added
  - [x] show the contracts and the selector only if, the party is selected
  - [ ] show the declarers and opponents scores around the contract table
  - [x] Indicate Game winner (Radli) on players
  - [ ] show each game scroes as a table (collapsable)
  - [ ] create a better app icon and align the icon in the app bar
  - [ ] Tarock sheet: better Win by taker UI component, e.g: a button
  - [ ] usability
    - [ ] Game Properties: show score near the game score selector radio buttons
    - [ ] BidSelector: show the score near the bids
    - [ ] ContractsTable: show the the contra names instead of the values
    - [ ] ContractsTable: integrate bid variant into the bid column
  - [ ] refactor
    - [ ] Tarock sheet: move handler's logic to data layer, if possible
    - [ ] contract better calculation of the bid base score
    - [ ] game, contract: simplify create and update methods with same parameter set
    - [ ] refactor can silent, do not leak bids details to contract layer
      - [ ] Add canSilent method to contract too.
      - [ ] refactor ContractsTable to use the new can silent contracts.      
    - [ ] rename game props to camelCase, party_score, called_tarock
- [ ] Milestone 2, better game saving and history, store in a permanent storage, share a game
  - [ ] implement error handling and showing to the user
  - [ ] Set and save the mayor state
  - [ ] Save the DateTime to the Game
  - [ ] save the details of the previous games
    [ ] add random colors to player avatars
  - [ ] do some authentication / login / firebase
  - [ ] save the game to a DB e.g. Firebase
  - [ ] deploy the app to heroku / netlify / vercel / Firebase
  - [ ] share the game with others
  - [ ] refactor
    - [ ] TarockSheet extract a Game component from the tarock sheet
    - [ ] split contractSelector to smaller components
    - [ ] split ContractsTable to smaller components
- [ ] Milestone 3
  - [ ] save multiple nights
  - [ ] edit the previous games scores
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
