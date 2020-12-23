/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
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
export default function JsonComparator() {
  const websocketServer = useRef(null);
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
    return () => websocketServer.close();
  }, []);
  const [menu, setMenu] = useState({});
  const [menuIsDirty, setMenuIsDirty] = useState(true);
  const [lastTimeFetch, setLastTimeFetch] = useState(null);
  useEffect(() => {
    fetchJsonList();
  }, [menuIsDirty]);
  const [jsonFileName, setJsonFileName] = useState([]);
  const [jsonArray, setJsonArray] = useState([]);
  const [jsonArrayHeader, setJsonArrayHeader] = useState([]);
  const [benchIdMap, setBenchIdMap] = useState(new Map());
  useEffect(() => {
    const mapTmp = new Map();
    jsonArray.forEach((json) => {
      for (const benchmark in json.bench) {
        if (!mapTmp.has(json.bench[benchmark].id)) {
          mapTmp.set(
            json.bench[benchmark].id,
            json.bench[benchmark].description
          );
        }
      }
    });
    setBenchIdMap(mapTmp);
  }, [jsonArray]);
  const [showGradient, setShowGradient] = useState(false);
  const [comparisonMargin, setComparisonMargin] = useState(99);
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
                jsonArrayHeader={jsonArrayHeader}
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
          jsonArrayHeader={jsonArrayHeader}
          onClick={menuOnClick}
        />
      );
    }
  };
  const menuOnClick = ({ key }) => {
    fetch(
      (constants.localUrl + constants.apiUrl + constants.urlParameters).concat(
        jsonFileName[key]
      )
    )
      .then((response) => response.json())
      .then((responseJSON) => {
        setJsonArray([...jsonArray, responseJSON]);
        setJsonArrayHeader([...jsonArrayHeader, jsonFileName[key]]);
      });
  };
  const deleteJson = (key) => {
    const tmpJsonArray = [...jsonArray];
    const tmpJsonArrayHeader = [...jsonArrayHeader];
    tmpJsonArray.splice(key, 1);
    tmpJsonArrayHeader.splice(key, 1);
    setJsonArray(tmpJsonArray);
    setJsonArrayHeader(tmpJsonArrayHeader);
  };
  const swapJson = (a, b) => {
    const tmpArray = [...jsonArray];
    const tmpArrayH = [...jsonArrayHeader];
    [tmpArray[a], tmpArray[b]] = [tmpArray[b], tmpArray[a]];
    [tmpArrayH[a], tmpArrayH[b]] = [tmpArrayH[b], tmpArrayH[a]];
    setJsonArray(tmpArray);
    setJsonArrayHeader(tmpArrayH);
  };
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
    const arr = [...jsonArray];
    const header = [...jsonArrayHeader];
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
    setJsonArray(arr);
    setJsonArrayHeader(header);
  };
  const handleUploadedFiles = async (e) => {
    for (let index = 0; index < e.target.files.length; index++) {
      const files = [...jsonArray];
      const filesName = [...jsonArrayHeader];
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
          setJsonArray(files);
          setJsonArrayHeader(filesName);
        }
      };
      reader.readAsText(e.target.files[index]);
    }
  };
  return (
    <>
      <h1>Benchmark comparator hook version</h1>
      <Divider />
      <JsonFilePicker
        menu={menu}
        disabled={menu === {}}
        fetchJsonList={() => fetchJsonList()}
        handleUploadedFiles={handleUploadedFiles}
      />
      <Divider />
      <GradientSelector
        checked={showGradient}
        onChangeSwitch={(check) => setShowGradient(check)}
        onChangeSlider={(val) => setComparisonMargin(val)}
        value={comparisonMargin}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        {
          <Table
            comparisonMargin={comparisonMargin}
            showGradient={showGradient}
            key={uniqid()}
            thead={jsonArrayHeader}
            jsons={jsonArray}
            deleteJson={deleteJson}
            swapJson={swapJson}
            benchIdMap={benchIdMap}
          />
        }
      </DragDropContext>
    </>
  );
}
