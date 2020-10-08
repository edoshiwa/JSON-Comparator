import React from "react";

function TableHead(props) {
  return <th>{props.value}</th>;
}
function TableRow(props) {
  return <tr>{props.value}</tr>;
}
function TableData(props) {
  return <td>{props.value}</td>;
}

class Table extends React.Component {
  constructor(props) {
    super();
    this.state = {
      tableData: {
        thead: [],
        trow: [],
      },
    };
  }
  renderHead(value, index) {
    return <TableHead key={"h" + index.toString()} value={value} />;
  }
  renderData(value, rowIndex, columnIndex) {
    return (
      <TableData
        key={"i" + rowIndex.toString() + "j" + columnIndex.toString()}
        value={value}
      />
    );
  }
  renderRow(row, rowIndex) {
    return (
      <TableRow
        key={"r" + rowIndex.toString()}
        value={row.map((value, columnIndex) =>
          this.renderData(value, rowIndex, columnIndex)
        )}
      />
    );
  }
  render() {
    return (
      <table>
        <thead>
          <tr>
            {this.state.tableData.thead.map((element, index) =>
              this.renderHead(element, index)
            )}
          </tr>
        </thead>
        <tbody>
          {this.state.tableData.trow.map((value, rowIndex) =>
            this.renderRow(value, rowIndex)
          )}
        </tbody>
      </table>
    );
  }
}

export default Table;
