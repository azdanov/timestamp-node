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

import { send } from "micro";
import moment from "moment";
import { IncomingMessage, ServerResponse } from "http";
import url from "url";
import * as querystring from "querystring";

interface timeResponse {
    unix: string | null;
    natural: string | null;
}

export default (request: IncomingMessage, response: ServerResponse) => {
    const { pathname } = url.parse(request.url || "");

    console.log(pathname);
    const time: timeResponse = {
        unix: null,
        natural: null
    };

    if (pathname === "/") {
        const now = moment();
        time.unix = now.format("x");
        time.natural = now.format("LLLL");
    } else if (typeof pathname === "string") {
        const timeFormat = pathname.slice(1); // Remove leading '/'
        let parsed: moment.Moment;

        if (!Number.isNaN(Number(timeFormat))) {
            parsed = moment(+timeFormat);
        } else {
            parsed = moment(querystring.unescape(timeFormat));
        }

        if (parsed.isValid()) {
            time.unix = parsed.format("x");
            time.natural = parsed.format("LLLL");
        }
    }

    send(response, 200, time);
};
