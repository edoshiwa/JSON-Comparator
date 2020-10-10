import React, { useState } from "react";
import { format_time, format_space } from "./util.js";
import JsonSelector from "./json-selector.js";
//TODO Uniqid
var uniqid = require("uniqid");
function TableHead(props) {
  return <th scope="col">{props.value}</th>;
}

function TableRow(props) {
  return <tr className={props.className}>{props.value}</tr>;
}
function TableData(props) {
  return (
    <td className={props.className} rowSpan={props.rowSpan}>
      {props.value}
    </td>
  );
}
function renderHead(value, index) {
  return <TableHead key={"h" + index.toString()} value={value} />;
}
function renderData(value, rowIndex, columnIndex) {
  return <TableData key={uniqid()} value={value} />;
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
function renderRow(row, rowIndex) {
  return (
    <TableRow
      key={uniqid()}
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
  //console.log(data);
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
/*class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: this.props.tableData,
      map: new Map(),
      jsons: this.props.jsons,
    };
  }
  render() {
    return (
      <div>
        <table className="">
          <thead className="">
            <tr>
              {tableData.thead.map((element, index) =>
                renderHead(element, index)
              )}
            </tr>
          </thead>
          <tbody>{renderBenchMap(map, benchs)}</tbody>
        </table>
      </div>
    );
  }
}*/
const Table = (props) => {
  const { tableData } = props;
  const { thead } = props;
  console.log(thead);
  const jsons = props.jsons;
  const bench = tableData.bench;
  const bench2 = tableData.bench2;
  const benchs = [];
  jsons.forEach((e) => benchs.push(e.bench));
  //console.log(jsons);
  //benchs.push(bench);
  //benchs.push(bench2);
  let map = new Map();
  benchs.forEach((el) => keyMap(map, el));

  return (
    <div>
      <table className="">
        <thead className="">
          <tr>
            <th>Bench description</th>
            {thead.map((element, index) => renderHead(element, index))}
          </tr>
        </thead>
        <tbody>{renderBenchMap(map, benchs)}</tbody>
      </table>
    </div>
  );
};

export default Table;
