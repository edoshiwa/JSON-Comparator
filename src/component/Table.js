import uniqid from "uniqid";
import PropTypes from "prop-types";
import styled from "styled-components";
import React from "react";

const EmptyCell = styled.td`
  background-color: rgba(127, 127, 130, 0.699);
  text-align: center !important;
`;
/**
 * Create a table with or without checkboxes,
 * filled with data and with table header
 * @param {*} props
 * @return {*} a Table
 */
export const Table = (props) => {
  const selectedRows = props.rowSelection.selectedRows
    ? props.rowSelection.selectedRows
    : [];
  const onChange = props.rowSelection.onChange
    ? props.rowSelection.onChange
    : () => console.log("on change not def");
  const columns = props.columns ? props.columns : [];
  const data = props.data ? props.data : [];
  const checkboxes = props.checkboxes ? props.checkboxes : false;
  return (
    <table>
      <thead>
        <tr>
          {
            <TableHead
              data={data}
              columns={columns}
              checkboxes={checkboxes}
              selectedRows={selectedRows}
              onChange={onChange}
            />
          }
        </tr>
      </thead>
      <tbody>
        {
          <TableRows
            data={data}
            columns={columns}
            checkboxes={checkboxes}
            selectedRows={selectedRows}
            onChange={onChange}
          />
        }
      </tbody>
    </table>
  );
};
Table.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  checkboxes: PropTypes.bool,
  rowSelection: PropTypes.any,
  selectedRows: PropTypes.array,
  onChange: PropTypes.func,
};
/**
 * Create multiple table row with checkboxes and filled with data
 * @param {*} props
 * @return {*} a list of tr
 */
const TableRows = (props) => {
  const tableRow = [];
  const columns = props.columns ? props.columns : [];
  const data = props.data ? props.data : [];
  const checkboxes = props.checkboxes ? props.checkboxes : false;
  const selectedRows = props.selectedRows;
  const onChange = props.onChange;
  const keyList = ["all"];
  data.map((dataRow) => keyList.push(dataRow.key));
  data.map((dataRow) => {
    const row = [];
    if (checkboxes) {
      row.push(
        <td key={uniqid()}>
          <input
            type="checkbox"
            id={dataRow.key}
            key={uniqid()}
            checked={selectedRows.includes(dataRow.key)}
            onChange={() => {
              selectedRows.includes("all")
                ? selectedRows.splice(selectedRows.indexOf("all"), 1)
                : selectedRows.includes(dataRow.key)
                ? ""
                : selectedRows.length + 2 === keyList.length
                ? selectedRows.push("all")
                : "";
              selectedRows.includes(dataRow.key)
                ? selectedRows.splice(selectedRows.indexOf(dataRow.key), 1) &&
                  onChange(selectedRows)
                : selectedRows.push(dataRow.key) && onChange(selectedRows);
            }}
          />
        </td>
      );
    }

    columns.map((column) => {
      row.push(
        dataRow[column.dataIndex] !== null ? (
          <td key={uniqid()}>{dataRow[column.dataIndex]}</td>
        ) : (
          <EmptyCell key={uniqid()}>{"—"}</EmptyCell>
        )
      );
    });
    tableRow.push(<tr key={uniqid()}>{row}</tr>);
  });
  return tableRow;
};
/**
 * Create the table head of each column
 * @param {*} props
 * @return {*} a list of th
 */
const TableHead = (props) => {
  const data = props.data ? props.data : [];
  const checkboxes = props.checkboxes ? props.checkboxes : false;
  const columns = props.columns ? props.columns : [];
  const tableHeads = [];
  const selectedRows = props.selectedRows;
  const onChange = props.onChange;
  const keyList = ["all"];
  data.map((dataRow) => keyList.push(dataRow.key));
  if (checkboxes)
    tableHeads.push(
      <th key={uniqid()}>
        <input
          type="checkbox"
          id="all"
          checked={selectedRows.includes("all")}
          onChange={() => {
            selectedRows.includes("all") ? onChange([]) : onChange(keyList);
          }}
        />
      </th>
    );
  columns.map((column) => {
    tableHeads.push(<th key={uniqid()}>{column.title}</th>);
  });
  return tableHeads;
};
