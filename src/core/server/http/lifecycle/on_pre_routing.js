"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adoptToHapiOnRequest = adoptToHapiOnRequest;

var _router = require("../router");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var ResultType;

(function (ResultType) {
  ResultType["next"] = "next";
  ResultType["rewriteUrl"] = "rewriteUrl";
})(ResultType || (ResultType = {}));

const preRoutingResult = {
  next() {
    return {
      type: ResultType.next
    };
  },

  rewriteUrl(url) {
    return {
      type: ResultType.rewriteUrl,
      url
    };
  },

  isNext(result) {
    return result && result.type === ResultType.next;
  },

  isRewriteUrl(result) {
    return result && result.type === ResultType.rewriteUrl;
  }

};
/**
 * @public
 * A tool set defining an outcome of OnPreRouting interceptor for incoming request.
 */

const toolkit = {
  next: preRoutingResult.next,
  rewriteUrl: preRoutingResult.rewriteUrl
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
function adoptToHapiOnRequest(fn, log) {
  return async function interceptPreRoutingRequest(request, responseToolkit) {
    const hapiResponseAdapter = new _router.HapiResponseAdapter(responseToolkit);

    try {
      const result = await fn(_router.KibanaRequest.from(request), _router.lifecycleResponseFactory, toolkit);

      if (result instanceof _router.KibanaResponse) {
        return hapiResponseAdapter.handle(result);
      }

      if (preRoutingResult.isNext(result)) {
        return responseToolkit.continue;
      }

      if (preRoutingResult.isRewriteUrl(result)) {
        var _appState$rewrittenUr;

        const appState = request.app;
        appState.rewrittenUrl = (_appState$rewrittenUr = appState.rewrittenUrl) !== null && _appState$rewrittenUr !== void 0 ? _appState$rewrittenUr : request.url;
        const {
          url
        } = result; // TODO: Remove once we upgrade to Node.js 12!
        //
        // Warning: The following for-loop took 10 days to write, and is a hack
        // to force V8 to make a copy of the string in memory.
        //
        // The reason why we need this is because of what appears to be a bug
        // in V8 that caused some URL paths to not be routed correctly once
        // `request.setUrl` was called with the path.
        //
        // The details can be seen in this discussion on Twitter:
        // https://twitter.com/wa7son/status/1319992632366518277

        let urlCopy = '';

        for (let i = 0; i < url.length; i++) {
          urlCopy += url[i];
        }

        request.setUrl(urlCopy); // We should update raw request as well since it can be proxied to the old platform

        request.raw.req.url = url;
        return responseToolkit.continue;
      }

      throw new Error(`Unexpected result from OnPreRouting. Expected OnPreRoutingResult or KibanaResponse, but given: ${result}.`);
    } catch (error) {
      log.error(error);
      return hapiResponseAdapter.toInternalError();
    }
  };
}