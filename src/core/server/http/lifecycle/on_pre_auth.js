"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adoptToHapiOnPreAuth = adoptToHapiOnPreAuth;

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
})(ResultType || (ResultType = {}));

const preAuthResult = {
  next() {
    return {
      type: ResultType.next
    };
  },

  isNext(result) {
    return result && result.type === ResultType.next;
  }

};
/**
 * @public
 * A tool set defining an outcome of OnPreAuth interceptor for incoming request.
 */

const toolkit = {
  next: preAuthResult.next
};
/**
 * See {@link OnPreAuthToolkit}.
 * @public
 */

/**
 * @public
 * Adopt custom request interceptor to Hapi lifecycle system.
 * @param fn - an extension point allowing to perform custom logic for
 * incoming HTTP requests before a user has been authenticated.
 */
function adoptToHapiOnPreAuth(fn, log) {
  return async function interceptPreAuthRequest(request, responseToolkit) {
    const hapiResponseAdapter = new _router.HapiResponseAdapter(responseToolkit);

    try {
      const result = await fn(_router.KibanaRequest.from(request), _router.lifecycleResponseFactory, toolkit);

      if (result instanceof _router.KibanaResponse) {
        return hapiResponseAdapter.handle(result);
      }

      if (preAuthResult.isNext(result)) {
        return responseToolkit.continue;
      }

      throw new Error(`Unexpected result from OnPreAuth. Expected OnPreAuthResult or KibanaResponse, but given: ${result}.`);
    } catch (error) {
      log.error(error);
      return hapiResponseAdapter.toInternalError();
    }
  };
}