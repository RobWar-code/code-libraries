import {useState} from 'react';
import {
    Outlet
} from "react-router-dom";
import SVGNavBar from '../../components/SVGNavBar';
import SVGConvert from '../../libraries/SVGConvert';

export default function SVGRoot() {
    const [svgObject, setSvgObject] = useState([]);

    return (
        <>
        <SVGNavBar />
        <SVGConvert svgFileList={"svg-list.json"} svgFilePath={"/static/svg/"} svgObject={svgObject} setSvgObject={setSvgObject}/>
        <div id="detail">
            <Outlet />
        </div>
        </>
    )
}