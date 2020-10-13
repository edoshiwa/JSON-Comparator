import React from "react";
import { format_time, format_space } from "./util.js";
import { DeleteOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";

//DONE render platform info
//DONE del function

//function to create unique key for react
var uniqid = require("uniqid");
//Generate a th and give the col scope
function TableHead(props) {
  return <th scope="col">{props.value}</th>;
}

//Generate a row from multiple th or td
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
//render the generated th
function renderHead(value, index, popFunction) {
  return <TableHead key={"h" + index.toString()} value={value} />;
}
function renderHeaderWithDel(
  value,
  index,
  popFunction,
  swapFunction,
  tabLenght
) {
  console.log("tablenght =" + tabLenght);
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
    <div>
      {debut}
      {value}
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
//render the generated td
function renderData(value) {
  return <TableData key={uniqid()} value={value} />;
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
function renderRow(row) {
  return (
    <TableRow key={uniqid()} value={row.map((value) => renderData(value))} />
  );
}
//Generate a key map from benchmark to know the id and the description of all benchmark
//that have been fetch
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
          <TableData key={uniqid()} className={"informationData"} value={bench.platform.version} />
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
          <TableData key={uniqid()} className={"informationData"} value={bench.time} />
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
          <TableData key={uniqid()} className={"informationData"} value={bench.platform.OS} />
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
          <TableData key={uniqid()}  className={"informationData"} value={bench.platform.type} />
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
          <TableData key={uniqid()} className={"informationData"} value={bench.platform.uname} />
        )),
      ]}
    />
  );
  console.log(data);
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
  const { thead } = props;
  console.log(thead);
  const jsons = props.jsons;
  const benchs = [];
  jsons.forEach((e) => benchs.push(e.bench));
  let map = new Map();
  benchs.forEach((el) => keyMap(map, el));
  const deleteColumn = (key) => {
    props.deleteJson(key);
  };
  const swapColumn = (a, b) => {
    props.swapJson(a, b);
  };
  renderBenchInfo(jsons);
  return (
    <div>
      <table className="">
        <thead className="">
          <tr>
            <th>Bench description</th>
            {thead.map((element, index) =>
              renderHeaderWithDel(
                element,
                index,
                deleteColumn,
                swapColumn,
                thead.length
              )
            )}
          </tr>
        </thead>
        <tbody>
          {renderBenchInfo(jsons)}
          {renderBenchMap(map, benchs)}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
