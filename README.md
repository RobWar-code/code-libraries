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

### Library Requirements
SVGConvert.js
svgPlot.js
misc.js

### Suggested Image Production Procedures
For work with graphic objects in code, the following approach is
suggested:

1) Generate and select trial image using monochrome line drawings with
DALL-E. Download as .png.

2) Edit drawings using GIMP or similar.

3) Import into Inkscape and trace and scale, saving the traced image as an .svg
file

4) Edit any transparent areas manually using inkscape, following the procedures
given below for establishing transparent areas.

5) Test the .svg image using this svg utility library. Integrate into the 
program code. It is suggested that you incorporate the test code into your
app, or set-up a special app for this purpose.

#### Establishing Transparent Areas in an Inkscape Trace

1) Following around the area of drawing to be made transparent, use the
bezier curve drawing tool to set the nodes and lines of the area to be
made transparent. Fill this 50% Opaque Red (0xff000080).

2) Move your shape area out of the way and from the trace, delete the
nodes within your area.

3) Move your shape back into position then save the svg drawing.

### svg Data
The svg data is as provided in the inkscape originated file format.

#### Traced Format Svg
When a .png file is imported and traced by inkscape, it produces a single
path d= pathset. The first path is the black background and the subsequent
the transparent feature overlay.

This creates a problem if the graphic has both solid and transparent regions,
since in effect we are using only two colours, not three.

Assuming that we can identify the regions in the svg that should be transparent
we then have the problem of how to "cut them out" from the first black background
path.

To make a cut-out we can establish four nodes two in the outer path and two in the
cut-out path such that they form a channel between the two shapes. The shape of
the cut-out can then be merged in with the coordinates of the outer path.

The function doPathCutout(outerPath, cutoutPath) in svgPlot.js can be used for this
purpose, using the svgObject type data.

As a convention, to allow the graphic designer to incorporate transparent
regions easily into their graphic traces. The inkscape user first outlines the
region to be made transparent using the bezier node/line tool. He sets
the fill to 50% opaque red. He then deletes the trace design nodes that lie beneath, 
and then moves his transparent shape back into position.

When the svg conversion program detects the fill 0xff0000 and fill-opacity opacity 0.5
it marks the pathSet object with the element cutout: true, and also sets the flag
cutoutsDue. So that the conversion program knows to perform the cutout operations.

### Conversion Functions

Caveat: This conversion function allows for only one group in the
source drawing, it does not cater for nested groups. Neither does
it deal with multiple layers.

The conversion functions (svg to object conversion) obtain the svg 
files from site-local server files using a standardised json 
"shopping list" which is read first from the given site-local file.

The functions are encapsulated in components in the libraries directory
all the svg files and the list must be placed in the public folder of the 
app.

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
            pathSets: [
                {
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
                    paths: [
                        {
                            closed: true;
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