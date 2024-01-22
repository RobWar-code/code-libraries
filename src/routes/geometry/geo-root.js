import {
    Outlet
} from "react-router-dom";
import GeoNavBar from '../../components/GeoNavBar';

export default function GeoRoot() {

    return (
        <>
        <GeoNavBar />
        <div id="detail">
            <Outlet />
        </div>
        </>
    )
}