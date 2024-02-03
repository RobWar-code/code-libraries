/*
    Miscellaneous useful functions, this should be included
    in the libraries copied across to your app/libraries
    folder
*/

/**
 * 
 * @param {*} s - A string which may be numeric
 * return - true if number or false otherwise
 */
export function isNumber(s) {
    return Number.isFinite(+s);
}