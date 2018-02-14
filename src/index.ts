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

    if (pathname && pathname.length > 1) {
        pathname = pathname.slice(1); // Remove leading slash
    } else if (typeof pathname === "undefined" || pathname === null) {
        pathname = "";
    }

    return pathname;
}

function setParsedTime(pathname: string) {
    let momentParsed: moment.Moment;

    const isNumber = !Number.isNaN(Number(pathname));
    if (isNumber) {
        momentParsed = moment(+pathname);
    } else {
        const momentTimeFormats = [moment.ISO_8601, moment.RFC_2822, "MMM DD, YYYY"];
        momentParsed = moment(querystring.unescape(pathname), momentTimeFormats);
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
