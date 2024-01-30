# Code Libraries

## Introduction
A set of library functions, including test procedures and presentations.
The code/test environment is also provided, with the aim of ensuring
that all library code can be found in one place.

## Code Layout
The on-screen menues (navigation bars) are hierarchical, with the top
level listing the libraries, subsequent layers the functions and their
test presentations.

## Setting-up a New Library
Go to the index.js file and add in a new route with the necessary children
for the library.

Add in a library subject directory to src/routes (ie: src/routes/my-library)

Create the root.js file for this library and the intro page in 
the routes/my-library file.

Create the library module in the src/libraries directory.

Create your test/demo pages in the routes/my-library folder

## Adjustments to the App for General Purpose Use

### Library Hierarchy

The home page level provides a description of the libraries in
general.

Currently the top level of the hierarchy has two pages
-geometry
-svg-pixi-graphics

Since the test presentations are generally pages, they appear
in the src/routes directory and are then sudivided into further
directories by library.

The route hierarchy is defined in src/index.js

Navbars are provided in src/components

Adjust the routes to be categorised by specific library

## Geometric Functions
These are available in src/libraries/geometry.js. They are
primarily concerned with circle geometry.

## Pixi-SVG Functions
The pixi-svg functions are concerned with the conversion of
inkscape svg drawing files to objects which can then be processed
by the graphic functions using the @pixi/react Graphics procedures
onto a <Stage> element. These are CONVERSION and PLOTTING functions.

It has relatively limited representation of svg's allowing for 
polylines and bezier curves and fill colour and multiple paths,
using the corresponding PIXI features.


### Conversion Functions

The conversion functions (svg to object conversion) obtain the svg 
files from site-local server files using a standardised json 
"shopping list" which is read first from the given site-local file.

The functions are encapsulated in components in the libraries directory
all the svg files must be placed in the public folder of the app.

Component: 

```js
// JSON shoppingList
[
    {
        fileName: "abcd.svg",
        handle: "mygraphic"
    },
    ..
]

// Usage
import {useState} from 'react';
import SVGConvert from '../libraries/SVGConversion';

const [svgObject, setSvgObject] = useState([]);
const [svgLoaded, setSvgLoaded] = useState([]);

// JSX
<App>

    { !svgLoaded &&
        <>
        <SVGConvert 
            fileList={"fileListFile.json"} 
            pathToFiles={"pathToFiles"}
            svgObject={svgObject} 
            setSvgObject={setSvgObject}
            setSvgLoaded={svgLoaded}
        />
        <Outlet context={[svgObject, setSvgObject]} />
        </>
    }

</App>
```

The svgObject is an array of objects which contains the reference handles of the file 
data with the graphical data for the drawing as an array of objects.

The fileList is the name of the json file that contains the list of files to be
parsed.

pathToFiles is the path of the files within the public directory. ie: "/static/svg/"

When converting the node coordinates, a final parse is made to adjust them to be based
on the upper and left-most coordinates in the data as 0,0.

The svg object has the following format:

```js
    [
        {
            handle: "mySVG",
            width: ,
            height: ,
            paths: [
                {
                    closed: true,
                    fill: none or 0xnnnnnn or url(..),
                    stroke: none or 0xnnnnnn,
                    stroke_width: 0.263935,
                    stroke_linecap: butt or round or square,
                    stroke_linejoin: mitre or round or bevel,
                    stroke_miterlimit: 4, 
                    stroke_dasharray_w: 0.263935, 
                    stroke_dasharray_h: 0.263935,
                    stroke_dashoffset:0,
                    stroke_opacity:1,
                    fill_opacity: 1,
                    opacity: 0.5,
                    nodes: [
                        {
                            curveParam1x: 70,
                            curveParam1y: 40,
                            curveParam2x: 50,
                            curveParam2y: 30,
                            x: 30.0,
                            y: 50.0
                        }
                    ]
                }

            ]
        }
    ]
```

Note that the coordinates are a direct translation of inkscape mm to pixels, 
the scale can be set by the plotting functions. All coordinates in the
object are absolute, so these are calculated from relative coordinates
in the svg source.

Note that the svg source data can have multiple closed shapes in a single path
data set.

### Plotting the SVGs

Having obtained the SVG data and converted it to an SVGObject, the svgPlotter function
is used as follows to plot the graphic

```js
import {Stage, Graphics} from "@pixi/react";
import {useOutletContext} from "react-router-dom";
import svgPlot from "../../libraries/svgPlot";

export default function SVGExamples () {
    const {svgLoaded, svgObject} = useOutletContext();

 
    const svgSamples = (g) => {
        g.clear();
        let found = svgPlot(g, svgObject, "square", 90, 100, {x:0.5, y:0.5}, 0.4);
        console.log("found square:", found);
        found = svgPlot(g, svgObject, "triangle", 240, 100, {x:0.5, y:0.5}, 0.4);
        console.log("found triangle", found);
    }

    return (
        <Stage width={600} height={400} options={{background: 0xd0d000, antialias: true}}>
            {/* <Graphics draw={bezierSample} /> */}
            {/* <Graphics draw={bezierSample2} /> */}
            {/* <Graphics draw={bezierMinMaxSample} /> */}
            { svgLoaded && 
                <Graphics draw={svgSamples} />
            }
        </Stage>
    )
}
```

## Schedule

Start Date: 20/01/2024

| Task                            | Est. Time | Actual     |
| ------------------------------- | --------- | ---------- |
| CONVERSION                      |           |            |
| Programming Interface Design    | 2         |  1         |
| Logical Objects Design          | 2         |  0.5       |
| Data Conversion Design          | 2         |  2         |
| Coding                          | 4         |  3         |
| Testing                         | 3         |  1         |
| ------------------------------- | --------- | ---------- |
| PLOTTING                        |           |            |
| Programming Interface Design    | 2         |  0.5       |
| Logical Object Design           | 2         |  0.5       |
| Coding                          | 6         |  1.5       |
| Testing                         | 4         |  1         |
| ------------------------------- | --------- | ---------- |
| TOTALS                          | 27        |  10.5      |
| ------------------------------- | ----------| ---------- |

Completion Date: 29/01/2024

Additional Work Arising

Resolution of multiple closed paths in a single path data set.