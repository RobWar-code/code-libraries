import {useState} from 'react';
import {
    Outlet
} from "react-router-dom";
import SVGNavBar from '../../components/SVGNavBar';
import SVGConvert from '../../libraries/SVGConvert';

export default function SVGRoot() {
    const [svgFileList, setSvgFileList] = useState([]);

    return (
        <>
        <SVGNavBar />
        <SVGConvert svgFilePath={"/static/svg/"} svgFileList={svgFileList} setSvgFileList={setSvgFileList} />
        <div id="detail">
            <Outlet />
        </div>
        </>
    )
}