import React from "react";
import {
  calculateContract,
  Contract,
  UpdateContractProps,
} from "../models/contractModel";
import { upperCaseToWords } from "../lib/util";
import {
  TableContainer,
  TableHead,
  TableBody,
  Table,
  TableCell,
  TableRow,
  IconButton,
  Button,
  Checkbox,
  Typography as T,
} from "@material-ui/core";
import { MdDelete as RemoveIcon } from "react-icons/md";
import { BidVariant, getBid } from "../lib/bid";
import VariantSelector from "./VariantSelector";
import SilentSwitch from "./SilentSwitch";
import MultiplierSelector from "./MultiplierSelector";
import {
  getAnotherPlayerType,
  getPlayerTypeColor,
  PLAYER_TYPE,
} from "../lib/player";
import curry from "lodash/fp/curry";

interface VariantSelectorModalProps {
  contract: Contract;
  onChange: (variant: BidVariant) => void;
}
const VariantSelectorModal = (props: VariantSelectorModalProps) => {
  const { contract, onChange } = props;
  const handleChange = (variant: BidVariant) => {
    onChange(variant);
  };
  const bid = getBid(contract.bidType);

  if (!bid.variants) {
    return null;
  }

  return (
    <>
      <VariantSelector
        variants={bid.variants || []}
        selected={contract.bidVariant}
        onChange={handleChange}
        render={(handleOpen) => (
          <Button
            variant="outlined"
            color="default"
            onClick={handleOpen}
            size="small"
          >
            {upperCaseToWords(contract.bidVariant ?? "Select variant")}
          </Button>
        )}
      />
    </>
  );
};

enum ACTION_TYPE {
  DELETE = "DELETE",
  CHANGE = "CHANGE",
}

type ContractField = keyof UpdateContractProps;
type Field = ContractField | string;
interface ColumnDefinition {
  field: Field;
  headerName: string;
  valueGetter?: (
    contract: Contract,
    onAction?: (actionType: ACTION_TYPE, value?: any) => void
  ) => React.ReactNode;
}
const columns: ColumnDefinition[] = [
  {
    field: "bidType",
    headerName: "Bid",
    valueGetter: (contract: Contract) => upperCaseToWords(contract.bidType),
  },
  {
    field: "bidVariant",
    headerName: "Variant",
    valueGetter: (contract, onAction) => {
      const handleChange = (variant: BidVariant) =>
        onAction && onAction(ACTION_TYPE.CHANGE, variant);

      return (
        <VariantSelectorModal contract={contract} onChange={handleChange} />
      );
    },
  },
  {
    field: "taker",
    headerName: "Taker",
    valueGetter: (contract, onAction) => {
      const newTaker = getAnotherPlayerType(contract.taker);
      const handleClick = () =>
        onAction && onAction(ACTION_TYPE.CHANGE, newTaker);
      const color = getPlayerTypeColor(contract.taker);
      return (
        <Button
          color={color}
          onClick={handleClick}
          variant="outlined"
          size="small"
        >
          {contract.taker}
        </Button>
      );
    },
  },
  {
    field: "silent",
    headerName: "Silent",
    valueGetter: (contract, onAction) => {
      const handleChange = (silent: boolean) =>
        onAction && onAction(ACTION_TYPE.CHANGE, silent);
      return (
        <SilentSwitch
          bidType={contract.bidType}
          onChange={handleChange}
          value={contract.silent}
        />
      );
    },
  },
  {
    field: "bidBaseScore",
    headerName: "Base Score",
  },
  {
    headerName: "Contra",
    field: "contra",
    valueGetter: (contract, onAction) => {
      const handleChange = (contra: number) =>
        onAction && onAction(ACTION_TYPE.CHANGE, contra);

      if (getBid(contract.bidType).denyContra) {
        return null;
      }
      return (
        <MultiplierSelector
          onChange={handleChange}
          value={contract.contra}
          disabled={contract.silent}
        />
      );
    },
  },
  {
    field: "winByTaker",
    headerName: "Win by the Taker?",
    valueGetter: (contract, onAction) => {
      const { winByTaker, taker } = contract;
      const handleClick = () => {
        const nextValue =
          winByTaker === null ? true : winByTaker === true ? false : null;
        onAction && onAction(ACTION_TYPE.CHANGE, nextValue);
      };

      const title =
        winByTaker === true
          ? "Won by the Taker!"
          : winByTaker === false
          ? "Lose by the Taker!"
          : "Still unknown / Not count in final score...";

      return (
        <Checkbox
          title={title}
          checked={winByTaker === true}
          indeterminate={winByTaker === null}
          onClick={handleClick}
          color={taker === PLAYER_TYPE.DECLARER ? "primary" : "secondary"}
        />
      );
    },
  },
  {
    field: "takerScore",
    headerName: "Taker score",
    valueGetter: (contract) => (
      <T
        variant="button"
        color={
          contract.taker === PLAYER_TYPE.DECLARER ? "primary" : "secondary"
        }
      >
        {calculateContract(contract)}
      </T>
    ),
  },
  {
    field: "actions",
    headerName: " ",
    valueGetter: (_, onAction) => {
      const handleClick = () => onAction && onAction(ACTION_TYPE.DELETE, null);
      return (
        <IconButton title="Remove" onClick={handleClick}>
          <RemoveIcon />
        </IconButton>
      );
    },
  },
];

const isContractField = (
  field: Field,
  contract: Contract
): field is ContractField => {
  return field in contract;
};

interface ContractsTableProps {
  contracts: Contract[];
  onChange: (index: number, field: keyof Contract, value: any) => void;
  onDelete: (index: number) => void;
}
const ContractsTable = (props: ContractsTableProps) => {
  const { contracts, onChange, onDelete } = props;

  function handleAction(
    index: number,
    field: ContractField | null,
    actionType: ACTION_TYPE,
    value: any
  ) {
    if (actionType === ACTION_TYPE.DELETE) {
      return onDelete(index);
    }
    if (actionType === ACTION_TYPE.CHANGE && field !== null) {
      return onChange(index, field, value);
    }
    throw new Error(
      `Invalid if ACTION_TYPE (${actionType}) is CHANGE the field can not be null.`
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={index}> {column.headerName} </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {contracts.map((contract, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column, cellIndex) => (
                <TableCell key={cellIndex}>
                  {isContractField(column.field, contract)
                    ? column.valueGetter
                      ? column.valueGetter(
                          contract,
                          curry(handleAction)(rowIndex)(column.field)
                        )
                      : contract[column.field]
                    : column.valueGetter
                    ? column.valueGetter(
                        contract,
                        curry(handleAction)(rowIndex)(null)
                      )
                    : " "}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ContractsTable;
