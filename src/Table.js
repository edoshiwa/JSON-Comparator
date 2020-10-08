import React from "react";
import { format_time, format_space } from "./util.js";
//TODO Uniqid
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
function renderDataKey(bench, id) {
  let timeValue = null;
  bench.map((elem) => {
    if (elem.id === id) {
      timeValue = elem.time;
    }
  });
  if (timeValue == null) {
    return <TableData key={"des" + id} value={"—"} rowSpan={1} />;
  } else {
    return (
      <TableData key={"des" + id} value={format_time(timeValue)} rowSpan={1} />
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
    return <TableData key={"des" + id} value={"—"} rowSpan={1} />;
  } else {
    return (
      <TableData
        key={"des" + id}
        value={format_space(spaceValue)}
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
  map.forEach((value, key, map) => {
    data.push([
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
          benchs.map((bench, index) => {
            return renderDataKeySpace(bench, key);
          }),
        ]}
      />,
    ]);
  });
  console.log(data);
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
/*
1: Création de la map : function_id => description_bench
  -> On parcours chaque JSON
    -> On regarde chaque bench
      -> On regarde si la map a déjà la clé si oui on passe, sinon on ajoute
2: Parcours de la map, pour chaque function_id :
  -> 2.1 : Affichage de description_bench avec rowspan = 2
  -> 2.2 : Parcours de chaque JSON
    -> 2.2.1 : Parcours de chaque bench, si clé du bench = function_id existe on affiche bench.time, sinon long tiret
    -> 2.2.2 : Parcours de chaque bench, si clé du bench = function_id existe on affiche bench.space, sinon long tiret
n : nombre de bench
m : longeur max de bench
Complexité max O(nm+2nm²), compléxité quadratique
*/
const Table = (props) => {
  const { tableData } = props;
  const bench = tableData.bench;
  const bench2 = tableData.bench2;
  let map = new Map();
  keyMap(map, bench);
  keyMap(map, bench2);

  /* map.forEach((element, key) =>
    console.log(<TableData key={"des" + key} value={element} rowSpan={2} />)
  );*/
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
