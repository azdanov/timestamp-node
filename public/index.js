'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var micro = require('micro');
var moment = _interopDefault(require('moment'));
var querystring = require('querystring');
var url = _interopDefault(require('url'));

function extractPathname(request) {
    let { pathname } = url.parse(request.url || "");
    if (typeof pathname === "string" && pathname.length > 1) {
        pathname = pathname.slice(1);
    }
    else if (typeof pathname === "undefined" || pathname === null) {
        pathname = "";
    }
    return pathname;
}
function setParsedTime(pathname) {
    let momentParsed;
    console.log(pathname);
    const isNumber = !Number.isNaN(Number(pathname));
    if (isNumber) {
        momentParsed = moment(+pathname);
    }
    else {
        momentParsed = moment(querystring.unescape(pathname));
    }
    return momentParsed;
}
function createTimeObject(momentNow) {
    return {
        unix: momentNow.format("x"),
        natural: momentNow.format("LLLL")
    };
}
function createEmptyTimeObject() {
    return {
        unix: null,
        natural: null
    };
}
var index = (request, response) => {
    const pathname = extractPathname(request);
    const isRoot = pathname === "/";
    let timeObject;
    let m;
    if (isRoot) {
        m = moment();
    }
    else {
        m = setParsedTime(pathname);
    }
    if (m.isValid()) {
        timeObject = createTimeObject(m);
    }
    else {
        timeObject = createEmptyTimeObject();
    }
    micro.send(response, 200, timeObject);
};

module.exports = index;
