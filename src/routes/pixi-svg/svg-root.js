import {useState, useEffect} from 'react';
import {
    Outlet
} from "react-router-dom";
import SVGNavBar from '../../components/SVGNavBar';
import SVGConvert from '../../libraries/SVGConvert';

export default function SVGRoot() {
    const [svgLoaded, setSvgLoaded] = useState(false);
    const [svgObject, setSvgObject] = useState([]);

    useEffect (() => {
        if (svgLoaded) {
            console.log("svgObject:", svgObject);
        }
    }, [svgObject, svgLoaded]);

    return (
        <>
        <SVGNavBar />
        { !svgLoaded ? (
            <SVGConvert 
                svgFileList={"svg-examples.json"} 
                svgFilePath={"/static/svg/"} 
                svgObject={svgObject} 
                setSvgObject={setSvgObject} 
                setSvgLoaded={setSvgLoaded}
            />
        ) : (
            <div id="detail">
                <Outlet context={{svgLoaded, svgObject}}/>
            </div>
        )}
        </>
    )
}