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

const micro = require("micro");
const test = require("ava");
const listen = require("test-listen");
const request = require("request-promise");
const microService = require(process.cwd() + "/public/index.js");
const moment = require("moment");

test("Endpoint is reachable", async t => {
    const service = micro(microService);

    const url = await listen(service);
    const body = await request(url);

    t.is(typeof JSON.parse(body), "object");
    service.close();
});

test("Response for '/' pathname", async t => {
    const service = micro(microService);

    const url = await listen(service);
    const body = await request(url);

    const now = moment();

    t.is(typeof JSON.parse(body).unix, "string");
    t.is(JSON.parse(body).natural, now.format("LLLL"));

    service.close();
});

test("Response for '/1450137600' pathname", async t => {
    const service = micro(microService);

    const url = await listen(service);
    const body = await request(url + "/1450137600");

    t.is(typeof JSON.parse(body).unix, "string");
    t.is(JSON.parse(body).natural, "Saturday, January 17, 1970 8:48 PM");
    service.close();
});

test("Response for '/06 Mar 2017 21:22:23 Z' pathname", async t => {
    const service = micro(microService);

    const url = await listen(service);
    const body = await request(url + encodeURI("/06 Mar 2017 21:22:23 Z"));

    t.is(typeof JSON.parse(body).unix, "string");
    t.is(JSON.parse(body).natural, "Monday, March 6, 2017 11:22 PM");
    service.close();
});

test("Response for wrong pathname", async t => {
    const service = micro(microService);

    const url = await listen(service);
    const body = await request(url + encodeURI("/hello world"));

    t.is(JSON.parse(body).unix, null);
    t.is(JSON.parse(body).natural, null);
    service.close();
});
