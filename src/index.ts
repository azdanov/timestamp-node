/*
 * MIT License
 *
 * Copyright (c) 2018 Anton Zdanov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { IncomingMessage, ServerResponse } from "http";
import { send } from "micro";
import moment from "moment";
import * as querystring from "querystring";
import url from "url";

interface unixNaturalTime {
    unix: string | null;
    natural: string | null;
}

function extractPathname(request: IncomingMessage) {
    let { pathname } = url.parse(request.url || "");

    if (typeof pathname === "string" && pathname.length > 1) {
        pathname = pathname.slice(1); // Remove leading slash
    } else if (typeof pathname === "undefined" || pathname === null) {
        pathname = "";
    }

    return pathname;
}

function setParsedTime(pathname: string) {
    let momentParsed: moment.Moment;

    console.log(pathname);
    const isNumber = !Number.isNaN(Number(pathname));
    if (isNumber) {
        momentParsed = moment(+pathname);
    } else {
        momentParsed = moment(querystring.unescape(pathname));
    }

    return momentParsed;
}

function createTimeObject(momentNow: moment.Moment): unixNaturalTime {
    return {
        unix: momentNow.format("x"),
        natural: momentNow.format("LLLL")
    };
}

function createEmptyTimeObject(): unixNaturalTime {
    return {
        unix: null,
        natural: null
    };
}

export default (request: IncomingMessage, response: ServerResponse) => {
    const pathname = extractPathname(request);

    const isRoot = pathname === "/";
    let timeObject: unixNaturalTime;
    let m: moment.Moment;

    if (isRoot) {
        m = moment();
    } else {
        m = setParsedTime(pathname);
    }

    if (m.isValid()) {
        timeObject = createTimeObject(m);
    } else {
        timeObject = createEmptyTimeObject();
    }
    send(response, 200, timeObject);
};
