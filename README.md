# TODO

- [.] MVP
  - [x] ContractsTable, actions
    - [x] can change the silent property
    - [x] can change the variant
    - [x] can change the taker
    - [x] can change contra
      - [x] Add contra decrease, in the same field as the contra score
    - [x] can remove
  - [ ] Calculate score
    - [ ] contract: change winner to win by taker: boolean | null
    - [ ] ContractsTable: Add the winner column.
    - [ ] ContractsTable: Can change the winner.
    - [ ] contract: add calculate
    - [ ] game: add caclulate
    - [ ] ContractsTable: Add final score column
    - [ ] Tarock Sheet: show final score
  - [ ] if a contract is silent, it should not able to apply a contra on it, 
  - [ ] Add player handling
- [ ] Milesteone 1
  - [ ] add undo & redo (?)
  - [ ] shortcuts
    - [ ] when klopitzky ticked, remove all contracts and add klopiczky contract, and make it winner
    - [ ] when party game ticked add party automatically, remove klopiczky
    - [ ] remove reset game, use the new game button for the purpose
  - [ ] add confirmation to new game
  - [ ] refactor can silent, do not leak bids details to contract layer
    - [ ] Add canSilent method to contract too.
    - [ ] refactor ContractsTable to use the new can silent on contracts.
    and contra value should be 1
  - [ ] rename BidSelector to ContractSelector
  - [ ] rename TarockSheet to Game component
  - [ ] rename game props to camelCase, party_score, called_tarock
  - [ ] deploy the app to github pages + set up pipline
- [ ] Milestone 2
  - [ ] save the games locally
- [ ] Milestone 3
  - [ ] do some authentication / login
  - [ ] save the game to a DB e.g. Firebase
  - [ ] deploy the app to heroku / netlify / vercel
- [ ] create a better app icon
- [ ] align the icon in the app bar
- [ ] split bidselector to smaller components
- [ ] split ContractsTable to smaller components
- [x] Done
  - [x] ContractsTable
    - [x] Refactor the design extract Row instead of factory object to make or use an onAction callback
    - [x] Correct the typing on ColumnDefinition, field should not relate to the Contract
  - [x] remove bid from contract, only save the bid type for it
  - [x] TarockSheet: Add game properties
  - [x] Refactor score handling
    - [x] game: add a default party score (TOOK_THREE) when creating
    - [x] contract: add an obligatory bid base score
    - [x] game: recalulate the contracts base bid score if the party score changes
    - [x] ContractsTable, use the base bid score in table
