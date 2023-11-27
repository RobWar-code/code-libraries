import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./styles/index.css";
import Root from "./routes/root";
import Introduction from "./routes/introduction";
import LineCircleIntersects from "./routes/line-circle-intersects";
import CircleIntersects from "./routes/circle-intersects";

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
                path: "/line-circle-intersects",
                element: <LineCircleIntersects />
            },
            {
                path: "/circle-intersects",
                element: <CircleIntersects />
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
