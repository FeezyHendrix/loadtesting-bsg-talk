import { Url } from "url";
export function match(value, cases) {
  if (cases.hasOwnProperty(value)) {
    return cases[value]();
  } else if (cases.hasOwnProperty("default")) {
    return cases["default"]();
  } else {
    throw new Error("No matching case found and no default case provided");
  }
}

export const buildHeader = (_) => {
  return {
    'Content-Type': 'application/json',
    ..._
  }
}

export function replyHttp(code, message, res, data = null, headers = null) {
  res.writeHead(code, buildHeader(headers));
  res.end(JSON.stringify({ message, data }))
}

export function queryParser(path) {
  const parsedUrl = new URL(path);
  const queryString = parsedUrl.search.substring(1);

  const queryParameters = {};
  queryString.split('&').forEach(param => {
    const [key, value] = param.split('=');
    queryParameters[decodeURIComponent(key)] = decodeURIComponent(value);
  });

  return queryParameters;
}

export const catchAsync = (fn) => (req, res) => {
  Promise.resolve(fn(req, res)).catch(err => {
    console.log(err);
    replyHttp(400, "Bad request", res);
  });
};

export const getFullUrl = (req) => {
  return 'http://' + req.headers.host + req.url;
}