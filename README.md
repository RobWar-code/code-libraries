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


### Conversion Functions

The conversion functions (svg to object conversion) obtain the svg 
files from site-local server files using a standardised json 
"shopping list" which is read first from the given site-local file.

The functions are encapsulated in components
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

const [SVGObject, setSVGObject] = useState([]);

// JSX
<App>

    <SVGConvert 
        SVGObject={SVGObject} 
        shoppingList="shoppingListFile" 
        pathToFiles="pathToFiles" />
    <Outlet context={[SVGObject, setSVGObject]} />

</App>
```

The SVGObject is an array of objects which contains the reference handles of the file 
data with the graphical data for the drawing as an array of objects.

When converting the node coordinates, a final parse is made to adjust them to be based
on the upper and left-most coordinates in the data as 0,0.


### Plotting the SVGs

Having obtained the SVG data and converted it to an SVGObject, the SVGPlotter function
is used as follows to plot the graphic

```js
 // The handle is the name of the graphic derived from the original JSON file
 // g is the @pixi/react graphics object
 // anchor operates in the same way as @pixi/react image sprite anchor.
 SVGPlotter(handle, g, x, y, anchor, scale);
```
## Schedule

Start Date: 20/01/2024

| Task                            | Est. Time | Actual     |
| ------------------------------- | --------- | ---------- |
| CONVERSION                      |           |            |
| Programming Interface Design    | 2         |            |
| Logical Objects Design          | 2         |            |
| Data Conversion Design          | 2         |            |
| Coding                          | 4         |            |
| Testing                         | 3         |            |
| ------------------------------- | --------- | ---------- |
| PLOTTING                        |           |            |
| Programming Interface Design    | 2         |            |
| Logical Object Design           | 2         |            |
| Coding                          | 6         |            |
| Testing                         | 4         |            |
| ------------------------------- | --------- | ---------- |
| TOTALS                          | 27        |            |
| ------------------------------- | ----------| ---------- |


