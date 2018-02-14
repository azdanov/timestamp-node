/* eslint-disable import/no-dynamic-require */
const micro = require("micro");
const test = require("ava");
const listen = require("test-listen");
const request = require("request-promise");

const microService = require(`${process.cwd()}/public/index.js`);
const moment = require("moment");

test("Endpoint is reachable", async (t) => {
  const service = micro(microService);

  const url = await listen(service);
  const body = await request(url);

  t.is(typeof JSON.parse(body), "object");
  service.close();
});

test("Response for '/' pathname", async (t) => {
  const service = micro(microService);

  const url = await listen(service);
  const body = await request(url);

  const now = moment();

  t.is(typeof JSON.parse(body).unix, "string");
  t.is(JSON.parse(body).natural, now.format("LLLL"));

  service.close();
});

test("Response for '1450137600' pathname", async (t) => {
  const service = micro(microService);

  const url = await listen(service);
  const body = await request(`${url}/1450137600`);

  t.is(typeof JSON.parse(body).unix, "string");
  t.is(JSON.parse(body).natural, "Saturday, January 17, 1970 8:48 PM");
  service.close();
});

test("Response for '06 Mar 2017 21:22:23 Z' pathname", async (t) => {
  const service = micro(microService);

  const url = await listen(service);
  const body = await request(`${url}/${encodeURI("06 Mar 2017 21:22:23 Z")}`);

  t.is(typeof JSON.parse(body).unix, "string");
  t.is(JSON.parse(body).natural, "Monday, March 6, 2017 11:22 PM");
  service.close();
});

test("Response for 'December 15, 2015' pathname", async (t) => {
  const service = micro(microService);

  const url = await listen(service);
  const body = await request(`${url}/${encodeURI("December 15, 2015")}`);

  t.is(typeof JSON.parse(body).unix, "string");
  t.is(JSON.parse(body).natural, "Tuesday, December 15, 2015 12:00 AM");
  service.close();
});

test("Response for wrong pathname", async (t) => {
  const service = micro(microService);

  const url = await listen(service);
  const body = await request(url + encodeURI("/hello world"));

  t.is(JSON.parse(body).unix, null);
  t.is(JSON.parse(body).natural, null);
  service.close();
});
