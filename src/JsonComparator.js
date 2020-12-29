import React, { useEffect, useRef, useState } from "react";
import { Divider } from "antd";
import FileMenu from "./component/FileMenu/FileMenu";
import * as constants from "./constants/constants.js";
import JsonFilePicker from "./component/JsonComparatorHeader/JsonFilePicker/JsonFilePicker";
import GradientSelector from "./component/JsonComparatorHeader/GradientSelector/GradientSelector";
import { DragDropContext } from "react-beautiful-dnd";
import schema from "./json-schema.json";
import Ajv from "ajv";
import Table from "./Table.js";
import uniqid from "uniqid";
/**
 * JsonComparator is the main component for the JSON comparison page.
 * Don't forget to adjust the constant file if needed.
 * @return {*} a file picker, a table with selected JSON and options
 */
export default function JsonComparator() {
  const websocketServer = useRef(null);
  /**
   * Open WSS connection and parameters it
   */
  useEffect(() => {
    websocketServer.current = new WebSocket(constants.webSocketUrl);
    websocketServer.current.onopen = () => {
      websocketServer.current.send(
        JSON.stringify({
          type: "listener",
          user_id: uniqid(),
        })
      );
    };
    websocketServer.current.onmessage = (e) => {
      console.log("message recu");
      setMenuIsDirty(true);
    };
    websocketServer.current.onerror = (e) => {
      console.error(e.message);
      websocketServer.current.close();
    };
    websocketServer.current.onclose = (e) => {
      console.log(e.reason);
      setTimeout(() => {
        websocketServer.current = new WebSocket(constants.webSocketUrl);
      });
    };
    return () => websocketServer.current.close();
  }, []);
  const [menu, setMenu] = useState({});
  const [menuIsDirty, setMenuIsDirty] = useState(true);
  const [lastTimeFetch, setLastTimeFetch] = useState(null);
  /**
   * FetchJsonList whenever the menu is dirty
   */
  useEffect(() => {
    fetchJsonList();
  }, [menuIsDirty]);
  const [jsonFileName, setJsonFileName] = useState([]);
  const [jsons, setJsons] = useState({ jsonArray: [], jsonArrayHeader: [] });
  const [ranks, setRanks] = useState({ timeRanks: [], sizeRanks: [] });
  const [benchIdMap, setBenchIdMap] = useState(new Map());
  /**
   * Update the ID map whenever the selected JSON change
   * TODO : Voir quand useEffect est appellé
   */
  useEffect(() => {
    setBenchIdMap(mapUpdate());
  }, [jsons]);

  const [gradient, setGradient] = useState({
    showGradient: false,
    comparisonMargin: 99,
  });
  const mapUpdate = (jsonsTmp = jsons.jsonArray) => {
    const mapTmp = new Map();
    jsonsTmp.forEach((json) => {
      for (const benchmark in json.bench) {
        if (!mapTmp.has(json.bench[benchmark].id)) {
          mapTmp.set(
            json.bench[benchmark].id,
            json.bench[benchmark].description
          );
        }
      }
    });
    return mapTmp;
  };
  /**
   * Fetch again the JSON list if menuIsDirty or if the WSS connection is closed
   * and the menu hasn't been update in the last 5 second.
   * Else it will just refrech the Item Menu.
   */
  const fetchJsonList = () => {
    if (
      menuIsDirty ||
      (websocketServer.CLOSED &&
        Date.now() - lastTimeFetch > 5000) /* mettre WSS*/
    ) {
      if (menuIsDirty) console.log("FETCHING BC MENU DIRTY");
      else console.log("MORE THAN 5 SEC SINCE LAST FETCH");
      fetch(constants.localUrl + constants.apiUrl)
        .then((response) => response.json())
        .then(
          (responseJSON) => {
            setMenu(
              <FileMenu
                arr={responseJSON}
                jsonArrayHeader={jsons.jsonArrayHeader}
                onClick={menuOnClick}
              />
            );
            setMenuIsDirty(false);
            setLastTimeFetch(Date.now());
            setJsonFileName(responseJSON);
          },
          (error) => {
            alert(error);
          }
        );
    } else {
      setMenu(
        <FileMenu
          arr={jsonFileName}
          jsonArrayHeader={jsons.jsonArrayHeader}
          onClick={menuOnClick}
        />
      );
    }
  };
  /**
   * It will fetch the from the set Api the selected file
   * @param {number} key : index of element in dropdown
   * It will update the state by adding the new Json
   * and its file to respectively jsonArray and jsonArrayHeader
   */
  const menuOnClick = ({ key }) => {
    fetch(
      (constants.localUrl + constants.apiUrl + constants.urlParameters).concat(
        jsonFileName[key]
      )
    )
      .then((response) => response.json())
      .then((responseJSON) => {
        const tab = [...jsons.jsonArray, responseJSON];
        const tabHeader = [...jsons.jsonArrayHeader, jsonFileName[key]];
        ranking(tab);
        setJsons({ ...jsons, jsonArray: tab, jsonArrayHeader: tabHeader });
      });
  };
  /**
   * It will update the state of the class by deleting
   * a JSON and its corresponding title, in both
   * jsonArray and jsonArrayHeader states.
   * @param {number} key : index of element in jsonArray or jsonArrayHeader
   */
  const deleteJson = (key) => {
    const tmpJsonArray = [...jsons.jsonArray];
    const tmpJsonArrayHeader = [...jsons.jsonArrayHeader];
    tmpJsonArray.splice(key, 1);
    tmpJsonArrayHeader.splice(key, 1);
    ranking(tmpJsonArray);
    setJsons({
      ...jsons,
      jsonArray: tmpJsonArray,
      jsonArrayHeader: tmpJsonArrayHeader,
    });
  };
  /**
   * It will swap in state two JSON and their corresponding title.
   * @param {number} a the index of the first JSON
   * @param {number} b the index of the second JSON
   */
  const swapJson = (a, b) => {
    const tmpArray = [...jsons.jsonArray];
    const tmpArrayH = [...jsons.jsonArrayHeader];
    [tmpArray[a], tmpArray[b]] = [tmpArray[b], tmpArray[a]];
    [tmpArrayH[a], tmpArrayH[b]] = [tmpArrayH[b], tmpArrayH[a]];
    setJsons({ ...jsons, jsonArray: tmpArray, jsonArrayHeader: tmpArrayH });
  };
  /**
   * Callback function when a draggable has been dropped in a droppable area
   * @param {*} result data about the DnD context
   */
  const onDragEnd = (result) => {
    const { destination, source } = result;
    // if there is no destination, there is no change to do
    if (!destination) {
      return;
    }
    // if the destination is the source, there is no change to do
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    // We want to shift the dragged element at the right destination
    // We save the current state
    const arr = [...jsons.jsonArray];
    const header = [...jsons.jsonArrayHeader];
    // We save the dragged element in a tmp value
    const tmp = arr[source.index];
    // We delete the dragged element from the saved current state
    arr.splice(source.index, 1);
    // We push the dragged element at the right destination in the saved current state
    arr.splice(destination.index, 0, tmp);

    // same thing for the title
    const tmp2 = header[source.index];
    header.splice(source.index, 1);
    header.splice(destination.index, 0, tmp2);
    // we update the state and the component refresh
    setJsons({ ...jsons, jsonArray: arr, jsonArrayHeader: header });
  };
  /**
   * Handle file that are pass into the browser.
   * Everything happend locally. It will save them the same way
   * as there way fetched via api.
   * @param {*} e change event from file upload selector
   */
  const handleUploadedFiles = async (e) => {
    for (let index = 0; index < e.target.files.length; index++) {
      const files = [...jsons.jsonArray];
      const filesName = [...jsons.jsonArrayHeader];
      // push file name into the array without the .json extension
      filesName.push(
        e.target.files[index].name.split(".").slice(0, -1).join(".")
      );
      // Create a file reader
      const reader = new FileReader();
      // the callback function will be use when readAsText is called
      reader.onloadend = (e) => {
        const jsonTest = JSON.parse(e.target.result);

        const ajv = new Ajv();
        const validate = ajv.compile(schema);
        const valid = validate(jsonTest);
        console.log("est valide : " + valid);
        if (!valid) console.log(validate.errors);
        else {
          files.push(jsonTest);
          ranking(files);
          setJsons({ ...jsons, jsonArray: files, jsonArrayHeader: filesName });
        }
      };
      reader.readAsText(e.target.files[index]);
    }
  };
  /**
   * Order, row by row, the fastest to slowest benchmark
   * @param {*} jsons
   */
  const ranking = (jsons) => {
    console.log("Appel : fonction de ranking");
    const mapTmp = mapUpdate(jsons);
    const ranksTime = [];
    const ranksSize = [];
    mapTmp.forEach((elementMap, key) => {
      const unsortedResult = [];

      jsons.map((json, index) => {
        json.bench.map((benchmark) => {
          if (benchmark.id === key) {
            benchmark["index"] = index;
            unsortedResult.push(benchmark);
          }
        });
      });
      ranksSize[key] = [...unsortedResult.sort((a, b) => a.size - b.size)];
      ranksTime[key] = [...unsortedResult.sort((a, b) => a.time - b.time)];
    });
    setRanks({ ...ranks, timeRanks: ranksTime, sizeRanks: ranksSize });
  };
  return (
    <>
      <h1>Benchmark comparator hook version</h1>
      <Divider />
      <JsonFilePicker
        menu={menu}
        disabled={menu === {}}
        fetchJsonList={fetchJsonList}
        handleUploadedFiles={handleUploadedFiles}
      />
      <Divider />
      <GradientSelector
        checked={gradient.showGradient}
        onChangeSwitch={(check) =>
          setGradient({ ...gradient, showGradient: check })
        }
        onChangeSlider={(val) =>
          setGradient({ ...gradient, comparisonMargin: val })
        }
        value={gradient.comparisonMargin}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        {
          <Table
            comparisonMargin={gradient.comparisonMargin}
            showGradient={gradient.showGradient}
            key={uniqid()}
            thead={jsons.jsonArrayHeader}
            jsons={jsons.jsonArray}
            deleteJson={deleteJson}
            swapJson={swapJson}
            benchIdMap={benchIdMap}
            ranks={ranks}
          />
        }
      </DragDropContext>
    </>
  );
}
