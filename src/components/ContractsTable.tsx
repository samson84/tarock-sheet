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
  Button
} from "@material-ui/core";
import { canSilent, getBid } from "../lib/bid";
import { 
  MdDelete as RemoveIcon, 
  MdFilter2 as ContraIcon 
} from "react-icons/md"
import { PLAYER_TYPE } from "../lib/player";

interface ActionProps {
  contract: Contract
}
const Actions = (props: ActionProps) => {
  const {contract} = props;

  return (
    <>
      <IconButton title="Contra">
        <ContraIcon />
      </IconButton>
      <IconButton title="Remove">
        <RemoveIcon />
      </IconButton>
    </>
  )
}

interface ColumnDefinition {
  field?: keyof Contract;
  headerName: string;
  valueGetter?: (contract: Contract) => string | number | React.ReactElement;
}
const columns: ColumnDefinition[] = [
  {
    field: "bidType",
    headerName: "Bid",
    valueGetter: (contract: Contract) => {
      const bidName = upperCaseToWords(contract?.bidType);
      const bidVariant = contract.bidVariant ? ` (${contract.bidVariant})` : "";
      return `${bidName}${bidVariant}`;
    },
  },
  {
    field: "bidVariant",
    headerName: "Variant"
  },
  {
    field: "taker",
    headerName: "Taker",
    valueGetter: (contract) => {
      const color = contract.taker === PLAYER_TYPE.DECLARER
        ? "primary"
        : "secondary"
      return (
        <Button color={color}>{contract.taker}</Button>
      )
    }
  },
  {
    field: "silent",
    headerName: "Silent",
    valueGetter: (contract) => {
      const silentChangeable = canSilent(getBid(contract.bidType))
      return (
        <Switch checked={contract.silent} disabled={!silentChangeable} />
      )
    }
  },
  {
    headerName: "Score",
    valueGetter: (contract) => {
      const bid = getBid(contract.bidType)
      return typeof bid.score === "number"
        ? bid.score
        : "-"
      
    },
  },
  {
    headerName: "Contra",
    field: "contra"
  },
  {
    headerName: "Actions",
    valueGetter: (contract) => <Actions contract={contract} />
  }
];

interface ContractsTableProps {
  contracts: Contract[];
}
const ContractsTable = ({ contracts }: ContractsTableProps) => {
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
                  {column.valueGetter
                    ? column.valueGetter(contract)
                    : column.field
                      ? contract[column.field]
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
