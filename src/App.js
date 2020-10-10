import React, { useState } from "react";
import "./App.css";
import JsonSelector from "./json-selector.js";
import Table from "./Table.js";
var uniqid = require("uniqid");
let tableData2 = {
  thead: ["Description", "Fichier 1", "Fichier 2"],
  bench: [
    {
      description:
        "Creating array of 100 000 random strings that are 14 chars long",
      time: 33089200,
      space: 10291536,
      id: "b_arr_str_low",
    },
    {
      description:
        "Creating array of 1 000 000 random strings that are 14 chars long",
      time: 402681600,
      space: 75651664,
      id: "b_arr_str_high",
    },
    {
      description: "Creating array of 1 000 000 random int with a for loop",
      time: 169651800,
      space: 35651664,
      id: "b_arr_int_for",
    },
    {
      description: "Creating array of 1 000 000 random int with a for loop",
      time: 7493300,
      space: 35651664,
      id: "b_arr_int_fill",
    },
    {
      description:
        "Creating associative array of 500 000 int with key strings that are 14 chars long",
      time: 359065400,
      space: 40942200,
      id: "b_asso_array",
    },
    {
      description:
        "Creating 100 000 objects with 7 properties (3 Strings that are 14 chars long and \r\n                      4 int) and dynamically add one string property to each that are 14 chars long",
      time: 246556100,
      space: 26531920,
      id: "b_obj",
    },
  ],
  bench2: [
    {
      description:
        "RAND Creating array of 100 000 random strings that are 14 chars long",
      time: 51740100,
      space: 10291536,
      id: "b_arr_str_low2",
    },
    {
      description:
        "RAND Creating array of 1 000 000 random strings that are 14 chars long",
      time: 571318400,
      space: 75651664,
      id: "b_arr_str_high2",
    },
    {
      description:
        "Creating print of 3 000 000 random person that are not long",
      time: 1271318400,
      space: 27651664,
      id: "b_strong",
    },
  ],
};
let JSONs = [];
function updateTableData(JSON) {
  JSONs.push(JSON);
}

//<Table tableData={tableData2}/>
function App() {
  const [jsons, setJsons] = useState(JSONs);

  return (
    <div className="App">
      <JsonSelector key={uniqid()} update={updateTableData} />
      <Table key={uniqid()} tableData={tableData2} jsons={jsons} />
    </div>
  );
}

export default App;
