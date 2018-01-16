'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var micro = require('micro');
var moment = _interopDefault(require('moment'));
var url = _interopDefault(require('url'));
var querystring = require('querystring');

var index = (request, response) => {
    const { pathname } = url.parse(request.url || "");
    console.log(pathname);
    const time = {
        unix: null,
        natural: null
    };
    if (pathname === "/") {
        const now = moment();
        time.unix = now.format("x");
        time.natural = now.format("LLLL");
    }
    else if (typeof pathname === "string") {
        const timeFormat = pathname.slice(1);
        let parsed;
        if (!Number.isNaN(Number(timeFormat))) {
            parsed = moment(+timeFormat);
        }
        else {
            parsed = moment(querystring.unescape(timeFormat));
        }
        if (parsed.isValid()) {
            time.unix = parsed.format("x");
            time.natural = parsed.format("LLLL");
        }
    }
    micro.send(response, 200, time);
};

module.exports = index;
