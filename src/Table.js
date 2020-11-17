import React from "react";
import { formatTime, formatSize } from "./util.js";
import styled from "styled-components";
import { Droppable } from "react-beautiful-dnd";
import DraggableTable from "./Draggable-Table.jsx";
import PropTypes from "prop-types";

// Styled div
const TableList = styled.div`
  background-color: ${(props) => (props.isDraggingOver ? "green" : "white")};
  display: flex;
  border-collapse: collapse;
`;
const Container = styled.div`
  margin: 1px;
`;

// function to create unique key for react
const uniqid = require("uniqid");

/**
 * Generate a row from multiple th or td
 * @param {*} props with className and value are necessery for the table row
 * @property {*} className for CSS style
 * @property {*} value a list of th or td
 * @return {*} a table row
 */
function TableRow(props) {
  return <tr className={props.className}>{props.value}</tr>;
}
TableRow.propTypes = {
  className: PropTypes.string,
  value: PropTypes.any.isRequired,
};

/**
 * Generate a td with appropriate attributes
 * @param {*} props for the table data below
 * @property {*} className for CSS styling
 * @property {*} rowSpan When you need multiple row cell
 * @property {*} value value of the cell
 * @return {*} a td of 1 or 2 rowspan
 */
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
TableData.propTypes = {
  className: PropTypes.string,
  rowSpan: PropTypes.number,
  value: PropTypes.any.isRequired,
};

/**
 * render td if time data exist with associate id
 * if it doesn't exist it render a empty td
 * @param {*} bench list of bench
 * @param {*} id key of wanted function
 * @return {*} TableData JSX
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
      <TableData key={uniqid()} value={formatTime(timeValue)} rowSpan={1} />
    );
  }
}

/**
 * render td if size data exist with associate id
 * if it doesn't exist it render a empty td
 * @param {*} bench list of bench
 * @param {*} id key of wanted function
 * @return {*} TableData JSX
 */
function renderDataKeySpace(bench, id) {
  let spaceValue = null;
  bench.map((elem) => {
    if (elem.id === id) {
      spaceValue = elem.size;
    }
  });
  if (spaceValue == null) {
    return (
      <TableData key={uniqid()} value={"—"} rowSpan={1} className="vide" />
    );
  } else {
    return (
      <TableData key={uniqid()} value={formatSize(spaceValue)} rowSpan={1} />
    );
  }
}

/**
 * render the tbody from the map and the benchs
 * @param {*} map list of id of every benchId available in the loaded JSON
 * @param {*} benchs list of all benchs to render
 * @return {*} Array of TableRow
 */
function renderBenchMap(map, benchs) {
  const data = [];
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
/**
 * render the bench platform description
 * @param {*} benchs list of all benchs to render
 * @return {*} Array of TableRow
 */
function renderBenchInfo(benchs) {
  const data = [];
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
// render the bench information description
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
/**
 * Order, row by row, the fastest to slowest benchmark
 * @param {*} map available id
 * @param {*} jsons all charged jsons
 * @return {*} list of sorted array for each benchmark from the fastest/lighter bench to the slowest/heavier
 */
const ranking = (map, jsons) => {
  const ranksTime = [];
  const ranksSize = [];
  map.forEach((elementMap, key) => {
    const unsortedResult = [];

    jsons.map((json, index) => {
      json.bench.map((benchmark) => {
        if (benchmark.id === key) {
          benchmark["index"] = index;
          unsortedResult.push(benchmark);
        }
      });
    });
    console.log();
    // unsortedResult.map((e) => console.log(e));
    ranksSize[key] = [...unsortedResult.sort((a, b) => a.size - b.size)];
    /* ranksSize[key] = unsortedResult
      .sort(function (a, b) {
        return a.size - b.size;
      })
      .slice();*/
    ranksTime[key] = unsortedResult.sort(function (a, b) {
      return a.time - b.time;
    });
  });
  console.log("ranking : ");
  console.log(ranksSize);
  console.log(ranksTime);
  return [ranksTime, ranksSize];
};

const Table = (props) => {
  // Destructuring props
  const { thead, jsons, benchIdMap, showGradient, comparisonMargin } = props;
  const benchs = [];
  jsons.forEach((e) => benchs.push(e.bench));
  // console.log(benchIdMap.length);
  const map = new Map();
  if (benchIdMap != null) {
    // benchIdMap.forEach((element) => console.log(element));
    benchIdMap.forEach((element, key) => map.set(key, element));
  }
  const [ranksTime, ranksSize] = ranking(benchIdMap, jsons);
  // benchs.forEach((el) => keyMap(map, el));
  // map.forEach((element) => console.log(element));
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
                  comparisonMargin={comparisonMargin}
                  showGradient={showGradient}
                  key={thead[index]}
                  name={thead[index]}
                  json={json}
                  index={index}
                  map={map}
                  ranksTime={ranksTime}
                  ranksSize={ranksSize}
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
