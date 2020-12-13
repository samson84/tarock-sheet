import React from "react";
import { Contract } from "../lib/contract";
import { upperCaseToWords } from "../lib/util";
import {
  TableContainer,
  TableHead,
  TableBody,
  Table,
  TableCell,
  TableRow,
  IconButton,
  Switch,
  Button,
} from "@material-ui/core";
import { canSilent, getBid } from "../lib/bid";
import {
  MdDelete as RemoveIcon,
  MdFilter2 as ContraIcon,
} from "react-icons/md";
import { PLAYER_TYPE } from "../lib/player";
import curry from "lodash/fp/curry";

interface ActionProps {
  contract: Contract;
}
const Actions = (props: ActionProps) => {
  const { contract } = props;

  return (
    <>
      <IconButton title="Contra">
        <ContraIcon />
      </IconButton>
      <IconButton title="Remove">
        <RemoveIcon />
      </IconButton>
    </>
  );
};

enum ACTION_TYPE {
  DELETE="DELETE",
  CHANGE="CHANGE",
}

type ContractField = keyof Contract
type Field = ContractField | string
interface ColumnDefinition {
  field: Field;
  headerName: string;
  valueGetter?: (
    contract: Contract,
    onAction?: (
      actionType: ACTION_TYPE,
      value?: any
    ) => void
  ) => string | number | React.ReactElement;
}
const columns: ColumnDefinition[] = [
  {
    field: "bidType",
    headerName: "Bid",
    valueGetter: (contract: Contract) => upperCaseToWords(contract?.bidType),
  },
  {
    field: "bidVariant",
    headerName: "Variant",
  },
  {
    field: "taker",
    headerName: "Taker",
    valueGetter: (contract) => {
      const color =
        contract.taker === PLAYER_TYPE.DECLARER ? "primary" : "secondary";
      return <Button color={color}>{contract.taker}</Button>;
    },
  },
  {
    field: "silent",
    headerName: "Silent",
    valueGetter: (contract) => {
      const silentChangeable = canSilent(getBid(contract.bidType));
      return <Switch checked={contract.silent} disabled={!silentChangeable} />;
    },
  },
  {
    field: "bidBaseScore",
    headerName: "Base Score",
  },
  {
    headerName: "Contra",
    field: "contra",
  },
  {
    field: "actions",
    headerName: "Actions",
    valueGetter: (contract) => <Actions contract={contract} />,
  },
];

const isContractField = (field: Field , contract: Contract): field is ContractField => {
  return field in contract
}

interface ContractsTableProps {
  contracts: Contract[];
  onChange: (index: number, field: keyof Contract, value: any) => void;
  onDelete: (index: number) => void;
}
const ContractsTable = (props: ContractsTableProps) => {
  const {
    contracts,
    onChange,
    onDelete
  } = props;

  function handleAction(
    index: number,
    field: ContractField | null,
    actionType: ACTION_TYPE,
    value?: any
  ){
    if (actionType === ACTION_TYPE.DELETE) {
      return onDelete(index)
    }
    if (actionType === ACTION_TYPE.CHANGE && field !== null) {
      return onChange(index, field, value)    
    }
    throw new Error(`Invalid if ACTION_TYPE (${actionType}) is CHANGE the field can not be null.`)
  };

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
                  {
                    isContractField(column.field, contract)
                      ? column.valueGetter
                        ? column.valueGetter(contract, curry(handleAction)(rowIndex)(column.field))
                        : contract[column.field]
                      : column.valueGetter
                        ? column.valueGetter(contract, curry(handleAction)(rowIndex)(null))
                        : " "
                  }
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
