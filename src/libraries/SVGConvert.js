import { useState, useEffect, useRef } from 'react';


/* 
The SVGConvert component reads in the svgFileList and then scans the listed
svg files to convert them into an array of objects to be used by the svgPlot
function to create programmer defined graphic objects on a Stage component

The routine is an event driven parser that reads the json file list entry by
triggering a parser effect to process each file, one at a time.

*/
export default function SVGConvert({svgFileList, svgFilePath, svgObject, setSvgObject}) {
  const [fileLoading, setFileLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchNext, setFetchNext] = useState(false);
  const [processSvg, setProcessSvg] = useState(false);
  const fileNum = useRef(0);
  const fileJsonData = useRef([]);
  const filePath = useRef(svgFilePath);
  const listFile = useRef(svgFileList);
  const svgData = useRef("");
  const lastSvgHandle = useRef("");

  // Get the svg file list
  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      try {
        const fileListPath = filePath.current + listFile.current;
        const response = await fetch(fileListPath, {
          headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}  
        });
        
        // Check if the fetch was successful
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        fileJsonData.current = data;
        setFetchNext(true);
      } catch (error) {
        console.error("SVG file list fetching error: ", error.message);
        setError(error.message); // Set the error message to display in the UI
      } finally {
        setFileLoading(false); // Set loading to false regardless of outcome
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  // Main control loop for fetching the svg files
  useEffect ( () => {

    const fetchSvgData = async () => {
      try {
        const fileName = fileJsonData.current[fileNum.current].file;
        lastSvgHandle.current = fileJsonData.current[fileNum.current].handle;
        const fileListPath = filePath.current + fileName;
        console.log("fileListPath:", fileListPath);
        const response = await fetch(fileListPath, {
          headers: {'Content-Type': 'text/plain', 'Accept': 'text/plain'}  
        });
        
        // Check if the fetch was successful
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.text();
        console.log("data:", data);
        svgData.current = data;
        ++fileNum.current;
        // Set flag to process the svg data
        setProcessSvg(true);
        setFetchNext(false);
      } catch (error) {
        console.error("SVG file fetch error: ", error.message);
        setError(error.message); // Set the error message to display in the UI
      } finally {
        setFileLoading(false); // Set loading to false regardless of outcome
      }

    }

    if (fetchNext) {
      if (fileNum.current < fileJsonData.current.length) {
        setFileLoading(true);
        fetchSvgData();
      }
      else {
        setFetchNext(false);
      }
    }

  }, [fetchNext])

  // Process the svg file into a javascript array object
  useEffect( () => {

    const processSvgData = () => {
      let pathArray = [];
      let minX = 0;
      let minY = 0;
      let maxX = 0;
      let maxY = 0;
      let pathCount = 0;
      let gotPathSet = false;
      // Split svgData into lines
      const svgArray = svgData.current.split("\n");
      // Parse each line
      for (let i = 0; i < svgArray.length; i++) {
        let line = svgArray[i];
        if (line.indexOf("<g") !== -1) {
          gotPathSet = true;
        }
        else if (line.indexOf("</g>") !== -1) {
          gotPathSet = false;
        }
        // Identify path
        if (line.indexOf("<path") !== -1 && gotPathSet) {
          line = svgArray[++i];
          // Get styles
          if (line.indexOf("style=")) {
            let p = line.indexOf("\"");
            let s = line.substring(p + 1, line.length);
            p = s.indexOf("\"");
            let styleLine = s.substring(0, p);
            let styleObj = processStyleLine(styleLine);
          
            // Get Nodes
            line = svgArray[++i];
            if (line.indexOf("d=\"") !== -1) {
              p = line.indexOf("\"");
              let s = line.substring(p + 1, line.length);
              p = s.indexOf("\"");
              let nodeLine = s.substring(0, p);
              let [closed, minX1, minY1, maxX1, maxY1, nodeArray] = processNodeLine(nodeLine);
              if (pathCount === 0) {
                minX = minX1;
                minY = minY1;
                maxX = maxX1;
                maxY = maxY1;
              }
              else {
                if (minX1 < minX) minX = minX1;
                if (minY1 < minY) minY = minY1;
                if (maxX1 > maxX) maxX = maxX1;
                if (maxY1 > maxY) maxY = maxY1;
              }
              styleObj.closed = closed;
              styleObj.nodes = nodeArray;
            }
            ++pathCount;
            pathArray.push(styleObj);
          }
        }
      }
      // Adjust the path nodes to scale and origin
      pathArray = adjustNodes(minX, minY, pathArray);
      let width = maxX - minX + 1;
      let height = maxY - minY + 1;
      return [pathArray, width, height];
    }

    const processStyleLine = (styleLine) => {
      let styleObj = {};
      let styleItems = styleLine.split(";");
      for (let styleItem of styleItems) {
        // Process Item
        let p = styleItem.indexOf(":");
        let itemName = styleItem.substring(0, p);
        let itemValue = styleItem.substring(p + 1, styleItem.length);
        // If the name contains - replace it by _
        itemName = itemName.replace(/-/g, "_");
        // Check for hexadecimal numbers
        if (itemValue.substring(0, 1) === "#") {
          itemValue = hexCharToInt(itemValue);
        }
        styleObj[itemName] = itemValue;
      }
      return styleObj;
    }

    const processNodeLine = (nodeLine) => {
      let nodeArray = [];
      let nodeList = nodeLine.split(" ");
      let startOfNodes = true;
      let minX = 0;
      let minY = 0;
      let maxX = 0;
      let maxY = 0;
      let linkType = "";
      let node = {};
      let closed = false;
      for (let i = 0; i < nodeList.length; i++) {
        let lastNode = {}
        lastNode = {...node};
        node = {};
        let coords = nodeList[i].split(",");
        // Process directive tags
        if (coords.length === 1) {
          let flag = coords[0];
          switch (flag) {
            case "C":
              linkType = "CurveAbs";
              break;
            case "c":
              linkType = "CurveRel";
              break;
            case "H":
              linkType = "HorizontalAbs";
              break;
            case "h":
              linkType = "HorizontalRel";
              break;
            case "L":
              linkType = "LineAbs";
              break;
            case "l":
              linkType = "LineRel";
              break;
            case "M":
              linkType = "MoveAbs";
              break;
            case "m":
              linkType = "MoveRel";
              break;
            case "V":
              linkType = "VerticalAbs";
              break;
            case "v":
              linkType = "VerticalRel";
              break;
            case "Z":
              linkType = "Close";
              break;
            case "z":
              linkType = "Close";
              break;
            default:
              console.log("Problem with data in svg path");
              break;
          }
          if (linkType !== "Close") {
            coords = nodeList[++i].split(",");
          }
        }
        if (linkType !== "Close") {
          // Singleton Node (H or V)
          if (linkType === "HorizontalAbs") {
            node.x = parseFloat(coords[0]);
            node.y = lastNode.y;
          }
          else if (linkType === "HorizontalRel") {
            node.x = parseFloat(coords[0]) + lastNode.x;
            node.y = lastNode.y; 
          }
          else if (linkType === "VerticalAbs") {
            node.x = lastNode.x;
            node.y = lastNode.y;
          }
          else if (linkType === "VerticalRel") {
            node.x = lastNode.x;
            node.y = lastNode.y + parseFloat(coords[0]);
          }
          // Start of absolute nodes
          else if (linkType === "MoveAbs" || (startOfNodes && linkType === "MoveRel")) {
            node.x = parseFloat(coords[0]);
            node.y = parseFloat(coords[1]);
          }
          else if (linkType === "MoveRel") {
            node.x = lastNode.x + parseFloat(coords[0]);
            node.y = lastNode.y + parseFloat(coords[1]);
          }
          else if (linkType === "LineAbs") {
            node.x = parseFloat(coords[0]);
            node.y = parseFloat(coords[1]);
          }
          else if (linkType === "LineRel") {
            node.x = lastNode.x + parseFloat(coords[0]);
            node.y = lastNode.y + parseFloat(coords[1]);
          }
          // Curves
          else if (linkType === "CurveAbs") {
            node.curveParam1x = parseFloat(coords[0]);
            node.curveParam1y = parseFloat(coords[1]);
            coords = nodeList[++i].split(",");
            node.curveParam2x = parseFloat(coords[0]);
            node.curveParam2y = parseFloat(coords[1]);
            coords = nodeList[++i].split(",");
            node.x = parseFloat(coords[0]);
            node.y = parseFloat(coords[1]);
          }
          else if (linkType === "CurveRel") {
            node.curveParam1x = parseFloat(coords[0]) + lastNode.x;
            node.curveParam1y = parseFloat(coords[1]) + lastNode.y;
            coords = nodeList[++i].split(",");
            node.curveParam2x = parseFloat(coords[0]) + lastNode.x;
            node.curveParam2y = parseFloat(coords[0]) + lastNode.y;
            coords = nodeList[++i].split(",");
            node.x = parseFloat(coords[0]) + lastNode.x;
            node.y = parseFloat(coords[1]) + lastNode.y;
          }
          nodeArray.push(node);
          if (startOfNodes) {
            minX = node.x;
            minY = node.y;
            maxX = node.x;
            maxY = node.y;
          }
          else {
            if (node.x < minX) minX = node.x;
            if (node.x > maxX) maxX = node.x;
            if (node.y < minY) minY = node.y;
            if (node.y > maxY) maxY = node.y;
          }
        }
        else {
          closed = true;
          break;
        }
        startOfNodes = false;
      }
      return [closed, minX, minY, maxX, maxY, nodeArray];
    }

    const adjustNodes = (minX, minY, pathArray) => {
      const scale = 2;
      // For each path
      for (let i = 0; i < pathArray.length; i++) {
        // Adjust the nodes to the effective zero origin and rescale
        let nodeArray = pathArray[i].nodes;
        for (let j = 0; j < nodeArray.length; j++) {
          let node = nodeArray[j];
          pathArray[i].nodes[j].x = (node.x - minX) * scale;
          pathArray[i].nodes[j].y = (node.y - minY) * scale;
          if ("curveParam1x" in node) {
            pathArray[i].nodes[j].curveParam1x = (node.curveParam1x - minX) * scale;
            pathArray[i].nodes[j].curveParam1y = (node.curveParam1y - minY) * scale;
            pathArray[i].nodes[j].curveParam2x = (node.curveParam2x - minX) * scale;
            pathArray[i].nodes[j].curveParam2y = (node.curveParam2y - minY) * scale;
          }
        }
      }
      return pathArray;
    }

    const hexCharToInt = (s) => {
        // Skip leading #
        const hexVals="abcdef";
        let s1 = s.substring(1, s.length);
        let hexLen = s1.length;
        let pow = hexLen;
        let value = 0;
        for (let char of s1) {
          let pv = hexVals.indexOf(char);
          if (pv !== -1) {
            pv = 10 + pv;
          }
          else {
            pv = +char;
          }
          value += pv * (16 ** pow);
          --pow;
        }
        return value;
    }

    let svgItem = {};

    if (processSvg) {
      const [pathArray, width, height] = processSvgData();
      svgItem.handle = lastSvgHandle.current;
      svgItem.width = width;
      svgItem.height = height;
      svgItem.paths = pathArray;
      setSvgObject( prevSvgObject => [...prevSvgObject, svgItem] );
      setProcessSvg(false);
      setFetchNext(true);
    }

  }, [processSvg, setSvgObject])


  return (
    <>
    {fileLoading ? (
        <div>Loading...</div>
    ) :
    ( error ? (
        <div>Error: {error}</div>
      ) : (
        <div>
          <p>Svg Data Loaded</p>
        </div>
      )
    )}
    </>
  );
}
