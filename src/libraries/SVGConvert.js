import { useState, useEffect, useRef } from 'react';


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
      setFileLoading(true);
      fetchSvgData();
    }

  }, [fetchNext])

  // Process the svg file into a javascript array object
  useEffect( () => {

    const processSvgData = () => {
      let outputObj = [];
      // Split svgData into lines
      const svgArray = svgData.current.split("\n");
      // Parse each line
      for (let i = 0; i < svgArray.length; i++) {
        let line = svgArray[i];
        // Identify path
        if (line.indexOf("<path") !== -1) {
          line = svgArray[++i];
          if (line.indexOf("style=")) {
            let p = line.indexOf("\"");
            let s = line.substring(p + 1, line.length);
            p = s.indexOf("\"");
            let styleLine = s.substring(0, p);
            let styleObj = processStyleLine(styleLine);
            outputObj.push(styleObj);
          }
        }
      }

      console.log("Style Objects:", outputObj);
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

    if (processSvg) {
      processSvgData();
      setProcessSvg(false);
    }

  }, [processSvg])


  return (
    <>
    {fileLoading ? (
        <div>Loading...</div>
    ) :
    ( error ? (
        <div>Error: {error}</div>
      ) : (
        <div>
          <p>Data Loaded</p>
          {/* Render your data here */}
          <pre>{svgData.current}</pre>
        </div>
      )
    )}
    </>
  );
}
