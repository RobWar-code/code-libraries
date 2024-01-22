import { useState, useEffect, useRef } from 'react';


export default function SVGConvert({svgFilePath, svgFileList, setSvgFileList}) {
  const [jsonData, setJsonData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const filePath = useRef(svgFilePath);

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      try {
        console.log("Got Here");
        const fileListPath = filePath.current + 'svg-list.json';
        const response = await fetch(fileListPath, {
          headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}  
        });
        
        // Check if the fetch was successful
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("data:", data);
        // setJsonData(data);
      } catch (error) {
        console.error("Fetching error: ", error.message);
        setError(error.message); // Set the error message to display in the UI
      } finally {
        setLoading(false); // Set loading to false regardless of outcome
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <>
    {loading ? (
        <div>Loading...</div>
    ) :
    ( error ? (
        <div>Error: {error}</div>
      ) : (
        <div>
          <p>Data Loaded</p>
          {/* Render your data here */}
          {/* <pre>{JSON.stringify(jsonData, null, 2)}</pre> */}
        </div>
      )
    )}
    </>
  );
}
