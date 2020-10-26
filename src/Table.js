import React from "react";
import { format_time, format_space } from "./util.js";
import styled from "styled-components";
import { Droppable } from "react-beautiful-dnd";
import DraggableTable from "./Draggable-Table.jsx";

//Styled div
const TableList = styled.div`
  background-color: ${(props) => (props.isDraggingOver ? "green" : "white")};
  display: flex;
  border-collapse: collapse;
`;
const Container = styled.div`
  margin: 1px;
`;

//function to create unique key for react
var uniqid = require("uniqid");

//Generate a row from multiple th or td
function TableRow(props) {
  return <tr className={props.className}>{props.value}</tr>;
}
//Generate a td with appropriate attributes
function TableData(props) {
  return (
    <td className={props.className} rowSpan={props.rowSpan}>
      <div
        className={
          props.rowSpan === 2 ? "div-data-wrapper-double" : "div-data-wrapper"
        }
      >
        {props.value}
      </div>
    </td>
  );
}

//render td if time data exist with associate id
//if it doesn't exist it render a empty td
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
// same as above but for space value
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

/**
 * Generate a key map from benchmark to know the id and the description of all benchmark
 * that have been fetch
 */
function keyMap(map, benchmarks) {
  for (var bench in benchmarks) {
    if (!map.has(benchmarks[bench].id))
      map.set(benchmarks[bench].id, benchmarks[bench].description);
  }
}
//render the tbody from the map and the benchs
function renderBenchMap(map, benchs) {
  let data = [];
  map.forEach((value, key, map) => {
    data.push([
      <TableRow
        key={uniqid()}
        value={[
          <TableData
            key={uniqid()}
            value={value}
            rowSpan={2}
            className="description"
          />,

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
//render the bench platform description
function renderBenchInfo(benchs) {
  let data = [];
  data.push(
    <TableRow
      key={uniqid()}
      value={[
        <TableData
          className={"information"}
          key={uniqid()}
          value={"Version"}
        />,
        benchs.map((bench, index) => (
          <TableData
            key={uniqid()}
            className={"informationData"}
            value={bench.platform.version}
          />
        )),
      ]}
    />
  );
  data.push(
    <TableRow
      key={uniqid()}
      value={[
        <TableData className={"information"} key={uniqid()} value={"Time"} />,
        benchs.map((bench, index) => (
          <TableData
            key={uniqid()}
            className={"informationData"}
            value={bench.time}
          />
        )),
      ]}
    />
  );
  data.push(
    <TableRow
      key={uniqid()}
      value={[
        <TableData className={"information"} key={uniqid()} value={"OS"} />,
        benchs.map((bench, index) => (
          <TableData
            key={uniqid()}
            className={"informationData"}
            value={bench.platform.OS}
          />
        )),
      ]}
    />
  );
  data.push(
    <TableRow
      key={uniqid()}
      value={[
        <TableData className={"information"} key={uniqid()} value={"Type"} />,
        benchs.map((bench, index) => (
          <TableData
            key={uniqid()}
            className={"informationData"}
            value={bench.platform.type}
          />
        )),
      ]}
    />
  );
  data.push(
    <TableRow
      key={uniqid()}
      value={[
        <TableData className={"information"} key={uniqid()} value={"uname"} />,
        benchs.map((bench, index) => (
          <TableData
            key={uniqid()}
            className={"informationData"}
            value={bench.platform.uname}
          />
        )),
      ]}
    />
  );
  return data;
}
//render the bench information description
const renderTableInformation = (map) => {
  return (
    <table className="table-information">
      <thead>
        <tr>
          <th>
            <div className="div-table-header">
              <div className="div-text-table-header">Bench description</div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {renderBenchInfo([])}
        {renderBenchMap(map, [])}
      </tbody>
    </table>
  );
};

const Table = (props) => {
  //Destructuring props
  const { thead, jsons } = props;

  const benchs = [];
  jsons.forEach((e) => benchs.push(e.bench));

  let map = new Map();
  benchs.forEach((el) => keyMap(map, el));

  const deleteColumn = (key) => {
    console.log("deleting colum :" + key);
    props.deleteJson(key);
  };
  const swapColumn = (a, b) => {
    props.swapJson(a, b);
  };
  if (jsons.length > 0) {
    return (
      <Container>
        <Droppable droppableId={uniqid()} direction="horizontal">
          {(provided, snapshot) => (
            <TableList ref={provided.innerRef} {...provided.droppableProps}>
              {renderTableInformation(map)}
              {jsons.map((json, index) => (
                <DraggableTable
                  key={thead[index]}
                  name={thead[index]}
                  json={json}
                  index={index}
                  map={map}
                  theadLength={thead.length}
                  deleteColumn={deleteColumn}
                  swapColumn={swapColumn}
                />
              ))}
              {provided.placeholder}
            </TableList>
          )}
        </Droppable>
      </Container>
    );
  } else return null;
};

export default Table;
