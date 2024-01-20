import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./styles/index.css";
import Root from "./routes/root";
import Introduction from "./routes/introduction";

import GeoRoot from "./routes/geometry/geo-root";
import GeoIntro from "./routes/geometry/geo-intro";
import CircleToEdgeContact from "./routes/geometry/circle-to-edge-contact";
import FindClosestPointAndDistance from "./routes/geometry/find-closest-point-and-distance.js";
import LineCircleIntersects from "./routes/geometry/line-circle-intersects";
import CircleIntersects from "./routes/geometry/circle-intersects";
import RadialVectorPoints from "./routes/geometry/radial-vector-points.js";
import MovingCircleToArcContact from "./routes/geometry/moving-circle-to-arc-contact";

import SVGRoot from "./routes/pixi-svg/svg-root";
import SVGIntro from "./routes/pixi-svg/svg-intro"

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "/",
                element: <Introduction />
            },
            {
                path: "/geometry",
                element: <GeoRoot />,
                children: [
                    {
                        path: "/geometry",
                        element: <GeoIntro />
                    },
                    {
                        path: "/geometry/circle-to-edge-contact",
                        element: <CircleToEdgeContact />
                    },
                    { 
                        path: "/geometry/find-closest-point-and-distance",
                        element: <FindClosestPointAndDistance />
                    }, 
                    {
                        path: "/geometry/line-circle-intersects",
                        element: <LineCircleIntersects />
                    },
                    {
                        path: "/geometry/circle-intersects",
                        element: <CircleIntersects />
                    },
                    {
                        path: "/geometry/radial-vector-points",
                        element: <RadialVectorPoints />
                    },
                    {
                        path: "/geometry/moving-circle-to-arc-contact",
                        element: <MovingCircleToArcContact />
                    }
                ]
            },
            {
                path: "/pixi-svg",
                element: <SVGRoot />,
                children: [
                    {
                        path: "/pixi-svg",
                        element: <SVGIntro />
                    }

                ]
            }
        ]
    }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
