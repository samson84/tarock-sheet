# TODO
- [.] Milesteone 1
  - [x] handle multiple games, score sheet
    - [x] create new components of the score sheet
    - [x] add save game functionality, it saves the current scores to the table
    - [x] add tests
    - [x] add base score
  - [ ] usability
    - [ ] new contracts on the top of the ContractsTable
    - [ ] group the bids
    - [x] ContractTable: when a contract silent, show visually that the contra does not take into account.
    - [x] ContractTable: if a contract is silent, it should not able to apply a contra on it, 
    - [ ] Game Properties: show score near the game score selector radio buttons
    - [ ] BidSelector: show the score near the bids
    - [ ] ContractsTable: show the the contra names instead of the values
    - [ ] ContractsTable: integrate bid variant into the bid column
    - [ ] add confirmation to new game
    - [ ] disable contra for eight, nine tarock
    - [ ] ContractsTable: automatically won by the eight and nine tarock, klopiczky
    - [ ] when something is added with silent automatically win except ulti
    - [ ] make a global silent switch, it adds bids silently, and automatically win
    - [ ] create defaults for the vatiants
    - [ ] shortcuts
      - [ ] when klopitzky game ticked, add klopiczky contract, remove others
      - [ ] when party game ticked add party automatically
      - [x] remove reset game, use the new game button for the purpose
  - [ ] refactor
    - [ ] add current final score to game object
    - [ ] use one function to update the game score but in the game model, when something is changed
    - [ ] game, contract: simplify create and update methods with same parameter set
    - [ ] BidSelector: Refactor Modal to Dialog
    - [ ] refactor can silent, do not leak bids details to contract layer
      - [ ] Add canSilent method to contract too.
      - [ ] refactor ContractsTable to use the new can silent contracts.      
    - [ ] rename BidSelector to ContractSelector
    - [ ] rename TarockSheet to Game component
    - [ ] rename game props to camelCase, party_score, called_tarock
  - [ ] deploy the app to github pages + set up pipline
- [ ] Milestone 2
  - [ ] compact Contract Table
    - [ ] collapse fields
    - [ ] comapct view
    - [ ] row styling based on validInFinalScore
  - [ ] add undo & redo (?)
  - [ ] responsive design check
  - [ ] save the games locally
  - [ ] add license, contribution, proper readme
  - [ ] add hotkeys
- [ ] Milestone 3
  - [ ] do some authentication / login
  - [ ] save the game to a DB e.g. Firebase
  - [ ] deploy the app to heroku / netlify / vercel
  - [ ] refactor
    - [ ] create a better app icon
    - [ ] align the icon in the app bar
    - [ ] split bidselector to smaller components
    - [ ] split ContractsTable to smaller components
- [x] Done
  - [.] Milestone 1
    - [x] refactor game handling: remove validation rules, and validInFinalScore props, use winByTaker null instead and make it manually
  - [x] MVP
    - [x] Add player handling
    - [x] Calculate score
    - [x] ContractsTable, actions
    - [x] TarockSheet: Add game properties
    - [x] Recalculate scores, when a party type changes
    - [x] Deploy to github pages, w github actions
