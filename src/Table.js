import React from "react";
import { format_time, format_space } from "./util.js";

function TableHead(props) {
  return <th>{props.value}</th>;
}

function TableRow(props) {
  return <tr>{props.value}</tr>;
}
function TableData(props) {
  return <td rowSpan={props.rowSpan}>{props.value}</td>;
}
function renderHead(value, index) {
  return <TableHead key={"h" + index.toString()} value={value} />;
}
function renderData(value, rowIndex, columnIndex) {
  return (
    <TableData
      key={"i" + rowIndex.toString() + "j" + columnIndex.toString()}
      value={value}
    />
  );
}
function renderDataKey(benchValue, id) {
  if (benchValue.id === id) {
    return (
      <TableData
        key={"des" + benchValue.id}
        value={format_time(benchValue.time)}
        rowSpan={1}
      />
    );
  }
}
function renderDataKeySpace(benchValue, id) {
  if (benchValue.id === id) {
    return (
      <TableData
        key={"des" + benchValue.id}
        value={format_space(benchValue.space)}
        rowSpan={1}
      />
    );
  }
}
function renderRow(row, rowIndex) {
  return (
    <TableRow
      key={"r" + rowIndex.toString()}
      value={row.map((value, columnIndex) =>
        renderData(value, rowIndex, columnIndex)
      )}
    />
  );
}

function keyMap(map, benchmarks) {
  for (var bench in benchmarks) {
    if (!map.has(benchmarks[bench].id))
      map.set(benchmarks[bench].id, benchmarks[bench].description);
  }
}
function renderBenchMap(map, benchs) {
  let data = [];
  data = map.forEach((value, key, map) => {
    return [
      <TableRow
        value={[
          <TableData key={"des" + key} value={value} rowSpan={2} />,
          benchs.map((element, index) => {
            return renderDataKey(element, key);
          }),
        ]}
      />,
      <TableRow
        value={[
          benchs.map((element, index) => {
            return renderDataKey(element, key);
          }),
        ]}
      />,
    ];
  });
  return data;
}
function renderBench(bench) {
  let data = [];
  data = bench.map((bench, index) => {
    return [
      <TableRow
        value={[
          <TableData
            key={"des" + bench.id}
            value={bench.description}
            rowSpan={2}
          />,

          <TableData
            key={"time" + bench.id}
            value={format_time(bench.time)}
            rowSpan={1}
          />,
        ]}
      />,
      <TableRow
        value={[
          <TableData
            key={"space" + bench.id}
            value={format_space(bench.space)}
            rowSpan={1}
          />,
        ]}
      />,
    ];
  });
  return data;
}

const Table = (props) => {
  const { tableData } = props;
  const bench = tableData.bench;
  const bench2 = tableData.bench2;
  let map = new Map();
  keyMap(map, bench2);
  console.log(map);
  let description = bench.map((element) => element.description);

  return (
    <table>
      <thead>
        <tr>
          {tableData.thead.map((element, index) => renderHead(element, index))}
        </tr>
      </thead>
      <tbody>{renderBenchMap(map, [bench, bench2])}</tbody>
    </table>
  );
};

export default Table;
