"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adoptToHapiOnPreResponseFormat = adoptToHapiOnPreResponseFormat;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _router = require("../router");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var ResultType;

(function (ResultType) {
  ResultType["render"] = "render";
  ResultType["next"] = "next";
})(ResultType || (ResultType = {}));

const preResponseResult = {
  render(responseRender) {
    return {
      type: ResultType.render,
      body: responseRender.body,
      headers: responseRender === null || responseRender === void 0 ? void 0 : responseRender.headers
    };
  },

  isRender(result) {
    return result && result.type === ResultType.render;
  },

  next(responseExtensions) {
    return {
      type: ResultType.next,
      headers: responseExtensions === null || responseExtensions === void 0 ? void 0 : responseExtensions.headers
    };
  },

  isNext(result) {
    return result && result.type === ResultType.next;
  }

};
/**
 * A tool set defining an outcome of OnPreResponse interceptor for incoming request.
 * @public
 */

const toolkit = {
  render: preResponseResult.render,
  next: preResponseResult.next
};
/**
 * See {@link OnPreRoutingToolkit}.
 * @public
 */

/**
 * @public
 * Adopt custom request interceptor to Hapi lifecycle system.
 * @param fn - an extension point allowing to perform custom logic for
 * incoming HTTP requests.
 */
function adoptToHapiOnPreResponseFormat(fn, log) {
  return async function interceptPreResponse(request, responseToolkit) {
    const response = request.response;

    try {
      if (response) {
        const statusCode = isBoom(response) ? response.output.statusCode : response.statusCode;
        const result = await fn(_router.KibanaRequest.from(request), {
          statusCode
        }, toolkit);

        if (preResponseResult.isNext(result)) {
          if (result.headers) {
            if (isBoom(response)) {
              findHeadersIntersection(response.output.headers, result.headers, log); // hapi wraps all error response in Boom object internally

              response.output.headers = { ...response.output.headers,
                ...result.headers // hapi types don't specify string[] as valid value

              };
            } else {
              findHeadersIntersection(response.headers, result.headers, log);
              setHeaders(response, result.headers);
            }
          }
        } else if (preResponseResult.isRender(result)) {
          const overriddenResponse = responseToolkit.response(result.body).code(statusCode);
          const originalHeaders = isBoom(response) ? response.output.headers : response.headers;
          setHeaders(overriddenResponse, originalHeaders);

          if (result.headers) {
            setHeaders(overriddenResponse, result.headers);
          }

          return overriddenResponse;
        } else {
          throw new Error(`Unexpected result from OnPreResponse. Expected OnPreResponseResult, but given: ${result}.`);
        }
      }
    } catch (error) {
      log.error(error);
      const hapiResponseAdapter = new _router.HapiResponseAdapter(responseToolkit);
      return hapiResponseAdapter.toInternalError();
    }

    return responseToolkit.continue;
  };
}

function isBoom(response) {
  return response instanceof _boom.default.Boom;
}

function setHeaders(response, headers) {
  for (const [headerName, headerValue] of Object.entries(headers)) {
    response.header(headerName, headerValue); // hapi types don't specify string[] as valid value
  }
} // NOTE: responseHeaders contains not a full list of response headers, but only explicitly set on a response object.
// any headers added by hapi internally, like `content-type`, `content-length`, etc. are not present here.


function findHeadersIntersection(responseHeaders, headers, log) {
  Object.keys(headers).forEach(headerName => {
    if (Reflect.has(responseHeaders, headerName)) {
      log.warn(`onPreResponseHandler rewrote a response header [${headerName}].`);
    }
  });
}