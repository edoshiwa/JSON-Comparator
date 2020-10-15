import React from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import { format_time, format_space } from "./util.js";
var uniqid = require("uniqid");
const Table = styled.table`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  background-color: ${(props) => (props.isDragging ? "blue" : "white")};
`;
const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  background-color: ${(props) => (props.isDragging ? "blue" : "white")};
`;

function TableRow(props) {
  return <tr className={props.className}>{props.value}</tr>;
}
//Generate a td with appropriate attributes
function TableData(props) {
  return (
    <td className={props.className} rowSpan={props.rowSpan}>
      {props.value}
    </td>
  );
}
function renderBenchMap(map, benchs) {
  let data = [];
  map.forEach((value, key) => {
    data.push([
      <TableRow
        key={uniqid()}
        value={[
          benchs.map((element, index) => {
            return renderDataKey(element, key);
          }),
        ]}
      />,
      <TableRow
        key={uniqid()}
        className="bottow-row"
        value={[
          benchs.map((bench, index) => {
            return renderDataKeySpace(bench, key);
          }),
        ]}
      />,
    ]);
  });
  return data;
}
function renderDataKey(bench, id) {
  let timeValue = null;
  bench.map((elem) => {
    if (elem.id === id) {
      timeValue = elem.time;
    }
  });
  if (timeValue == null) {
    return (
      <TableData key={uniqid()} value={"—"} rowSpan={1} className="vide" />
    );
  } else {
    return (
      <TableData key={uniqid()} value={format_time(timeValue)} rowSpan={1} />
    );
  }
}
function renderDataKeySpace(bench, id) {
  let spaceValue = null;
  bench.map((elem) => {
    if (elem.id === id) {
      spaceValue = elem.space;
    }
  });
  if (spaceValue == null) {
    return (
      <TableData key={uniqid()} value={"—"} rowSpan={1} className="vide" />
    );
  } else {
    return (
      <TableData key={uniqid()} value={format_space(spaceValue)} rowSpan={1} />
    );
  }
}
export default class DraggableTable extends React.Component {
  render() {
    return (
      <Draggable draggableId={this.props.json.time} index={this.props.index}>
        {(provided, snapshot) => (
          <Table
            {...provided.draggableProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
          >
            <thead>
              <th {...provided.dragHandleProps}>{this.props.name}</th>
            </thead>
            <tbody>
              <TableRow
                key={uniqid()}
                value={[
                  <TableData
                    key={uniqid()}
                    className={"informationData"}
                    value={this.props.json.platform.version}
                  ></TableData>,
                ]}
              />
              <TableRow
                key={uniqid()}
                value={[
                  <TableData
                    key={uniqid()}
                    className={"informationData"}
                    value={this.props.json.time}
                  />,
                ]}
              />
              <TableRow
                key={uniqid()}
                value={[
                  <TableData
                    className={"informationData"}
                    key={uniqid()}
                    value={this.props.json.platform.OS}
                  ></TableData>,
                ]}
              />
              <TableRow
                key={uniqid()}
                value={[
                  <TableData
                    key={uniqid()}
                    className={"informationData"}
                    value={this.props.json.platform.type}
                  ></TableData>,
                ]}
              />
              <TableRow
                key={uniqid()}
                value={[
                  <TableData
                    key={uniqid()}
                    className={"informationData"}
                    value={this.props.json.platform.uname}
                  ></TableData>,
                ]}
              />
              <tr>
                <td>{this.props.json.time}</td>
              </tr>
              {renderBenchMap(this.props.map, [this.props.json.bench])}
            </tbody>
          </Table>
        )}
      </Draggable>
    );
  }
}
