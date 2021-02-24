import React from "react";
import * as Contract from "../models/Contract";
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
import * as Bid from "../models/Bid";
import VariantSelector from "./VariantSelector";
import SilentSwitch from "./SilentSwitch";
import MultiplierSelector from "./MultiplierSelector";
import * as Player from "../models/Player";
import curry from "lodash/fp/curry";

interface VariantSelectorModalProps {
  contract: Contract.Props;
  onChange: (variant: Bid.Variant) => void;
}
const VariantSelectorModal = (props: VariantSelectorModalProps) => {
  const { contract, onChange } = props;
  const handleChange = (variant: Bid.Variant) => {
    onChange(variant);
  };
  const bid = Bid.getByType(contract.bidType);

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

type ContractField = keyof Contract.UpdateProps;
type Field = ContractField | string;
interface ColumnDefinition {
  field: Field;
  headerName: string;
  valueGetter?: (
    contract: Contract.Props,
    onAction?: (actionType: ACTION_TYPE, value?: any) => void
  ) => React.ReactNode;
}
const columns: ColumnDefinition[] = [
  {
    field: "bidType",
    headerName: "Bid",
    valueGetter: (contract: Contract.Props) =>
      upperCaseToWords(contract.bidType),
  },
  {
    field: "bidVariant",
    headerName: "Variant",
    valueGetter: (contract, onAction) => {
      const handleChange = (variant: Bid.Variant) =>
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
      const newTaker = Player.getOppositeType(contract.taker);
      const handleClick = () =>
        onAction && onAction(ACTION_TYPE.CHANGE, newTaker);
      const color = Player.getTypeColor(contract.taker);
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
    field: "isSilent",
    headerName: "Silent",
    valueGetter: (contract, onAction) => {
      const handleChange = (isSilent: boolean) =>
        onAction && onAction(ACTION_TYPE.CHANGE, isSilent);
      return (
        <SilentSwitch
          bidType={contract.bidType}
          onChange={handleChange}
          value={contract.isSilent}
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

      if (Bid.getByType(contract.bidType).isDenyContra) {
        return null;
      }
      return (
        <MultiplierSelector
          onChange={handleChange}
          value={contract.contra}
          disabled={contract.isSilent}
        />
      );
    },
  },
  {
    field: "isWonByTaker",
    headerName: "Win by the Taker?",
    valueGetter: (contract, onAction) => {
      const { isWonByTaker, taker } = contract;
      const handleClick = () => {
        const nextValue =
          isWonByTaker === null ? true : isWonByTaker === true ? false : null;
        onAction && onAction(ACTION_TYPE.CHANGE, nextValue);
      };

      const title =
        isWonByTaker === true
          ? "Won by the Taker!"
          : isWonByTaker === false
          ? "Lose by the Taker!"
          : "Still unknown / Not count in final score...";

      return (
        <Checkbox
          title={title}
          checked={isWonByTaker === true}
          indeterminate={isWonByTaker === null}
          onClick={handleClick}
          color={taker === Player.TYPE.DECLARER ? "primary" : "secondary"}
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
          contract.taker === Player.TYPE.DECLARER ? "primary" : "secondary"
        }
      >
        {Contract.calculateContractScore(contract)}
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
  contract: Contract.Props
): field is ContractField => {
  return field in contract;
};

interface ContractsTableProps {
  contracts: Contract.Props[];
  onChange: (index: number, field: keyof Contract.Props, value: any) => void;
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
