# TODO

- [ ] refactor can silent, do not leak bids details to contract layer
  - [ ] Add canSilent method to contract too.
  - [ ] refactor ContractsTable to use the new can silent on contracts.
- [ ] ContractsTable
  - [ ] Refactor the design extract Row instead of factory object to make or add onChange method to the valueGetter easier the change the specific element.
- [ ] ContractsTable, actions
  - [ ] can change the silent property
  - [ ] can change the variant
  - [ ] can change the taker
  - [ ] can contra
  - [ ] can remove
- [ ] Calculate score
  - [ ] ContractsTable: Add the winner column.
  - [ ] ContractsTable: Can change the winner.
  - [ ] contract: add calculate
  - [ ] game: add caclulate
  - [ ] ContractsTable: Add final score column
  - [ ] Tarock Sheet: show final score
- [ ] Add player handling
- [ ] Add contra decrease, maybe in the same field as the contra score
- [ ] create a better app icon
- [ ] align the icon in the app bar
- [ ] split bidselector to smaller components
- [ ] split ContractsTable to smaller components
- [x] remove bid from contract, only save the bid type for it
- [x] TarockSheet: Add game properties
- [x] Refactor score handling
  - [x] game: add a default party score (TOOK_THREE) when creating
  - [x] contract: add an obligatory bid base score
  - [x] game: recalulate the contracts base bid score if the party score changes
  - [x] ContractsTable, use the base bid score in table
