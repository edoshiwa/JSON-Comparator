import React from "react";
import "./App.css";
import Table from "./Table.js";

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
        "Creating array of 100 000 random strings that are 14 chars long",
      time: 51740100,
      space: 10291536,
      id: "b_arr_str_low",
    },
    {
      description:
        "Creating array of 1 000 000 random strings that are 14 chars long",
      time: 571318400,
      space: 75651664,
      id: "b_arr_str_high",
    },
  ],
};
function App() {
  return <Table tableData={tableData2} />;
}

export default App;
