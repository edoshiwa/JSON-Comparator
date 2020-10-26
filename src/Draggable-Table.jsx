import React from "react";
import styled from "styled-components";
import { DeleteOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Draggable } from "react-beautiful-dnd";
import { format_time, format_space } from "./util.js";
import "antd/dist/antd.css";
import "./index.css";
import { Tooltip } from "antd";
var uniqid = require("uniqid");
const Table = styled.table`
  border: ${(props) =>
    props.isDragging ? "1px solid rgb(233,106,40)" : "1px solid black"};
  background-color: ${(props) => (props.isDragging ? "cyan" : "white")};
  margin: -1px 0 0 -1px;
`;
/**
 * Return a JSX th
 * @param {*} props : props.value need to be define.
 */
function TableHead(props) {
  return <th scope="col">{props.value}</th>;
}
/**
 * Render a JSX th
 * @param {*} value : title of the th
 * @param {*} index : position of the th in the table list
 * @param {*} popFunction : function to pop the th
 * @param {*} swapFunction  : function to swap the th
 * @param {*} tabLenght : table list lenght
 */
function renderHeaderWithDel(
  value,
  index,
  popFunction,
  swapFunction,
  tabLenght
) {
  let debut =
    index === 0 ? null : (
      <button
        className="swapLeft"
        onClick={() => swapFunction(index - 1, index)}
      >
        {<LeftOutlined />}
      </button>
    );
  let fin =
    index === tabLenght - 1 ? null : (
      <button
        className="swapRight"
        onClick={() => swapFunction(index, index + 1)}
      >
        {<RightOutlined />}
      </button>
    );
  let val = (
    <div className="div-table-header">
      {debut}
      {
        <div className={"div-text-table-header"}>
          {
            <Tooltip title={value} color={"#009d8a"}>
              <span>{value}</span>
            </Tooltip>
          }
        </div>
      }
      <button
        className="del"
        onClick={() => popFunction(index)}
        shape="circle"
        ghost="true"
      >
        {<DeleteOutlined />}
      </button>
      {fin}
    </div>
  );
  return <TableHead key={"h" + index.toString()} value={val} />;
}
/**
 * Render a JSX tr
 * @param {*} props : one or more JSX td or th
 */
function TableRow(props) {
  return <tr className={props.className}>{props.value}</tr>;
}
/**
 * @returns JSX td element, its data is wrapped within a div to breakline
 * @param {*} props.rowSpan RowSpan of the cell
 * @param {*} props.value Value to render
 * @param {*} props.className  CSS style
 */
function TableData(props) {
  return (
    <td className={props.className} rowSpan={props.rowSpan}>
      <div className="div-data-wrapper">{props.value}</div>
    </td>
  );
}
/**
 * @return JSX render of multiple row of table Data
 * @param {*} map map of all bench
 * @param {*} benchs list of the bench
 */
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
/**
 * @returns JSX td, if value is not defined then it will render a dash
 * @param {*} bench list of the bench
 * @param {*} id id of the bench function that has been tested
 */
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
/**
 * Redundant function of renderDataKey but for space value
 */
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
              <tr {...provided.dragHandleProps}>
                {renderHeaderWithDel(
                  this.props.name,
                  this.props.index,
                  this.props.deleteColumn,
                  this.props.swapColumn,
                  this.props.theadLength
                )}
              </tr>
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
              {renderBenchMap(this.props.map, [this.props.json.bench])}
            </tbody>
          </Table>
        )}
      </Draggable>
    );
  }
}
