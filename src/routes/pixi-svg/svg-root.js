import {
    Outlet
} from "react-router-dom";
import SVGNavBar from '../../components/SVGNavBar';

export default function SVGRoot() {
    return (
        <>
        <SVGNavBar />
        <div id="detail">
            <Outlet />
        </div>
        </>
    )
}