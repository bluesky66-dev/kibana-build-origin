"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RouterMock = void 0;

var _saferLodashSet = require("@elastic/safer-lodash-set");

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

const responseIntercepted = {
  ok(response) {
    return response;
  },

  conflict(response) {
    response.status = 409;
    return response;
  },

  internalError(response) {
    response.status = 500;
    return response;
  },

  notFound(response) {
    response.status = 404;
    return response;
  }

};
/**
 * Create a proxy with a default "catch all" handler to make sure we don't break route handlers that make use
 * of other method on the response object that the ones defined in `responseIntercepted` above.
 */

const responseMock = new Proxy(responseIntercepted, {
  get: (target, prop) => prop in target ? target[prop] : response => response,
  has: () => true
});

class RouterMock {
  /**
   * Cache to keep a reference to all the request handler defined on the router for each HTTP method and path
   */
  constructor(pathToESclient = 'core.elasticsearch.dataClient') {
    _defineProperty(this, "cacheHandlers", {
      get: {},
      post: {},
      put: {},
      delete: {},
      patch: {}
    });

    _defineProperty(this, "_callAsCurrentUserCallCount", 0);

    _defineProperty(this, "_callAsCurrentUserResponses", []);

    _defineProperty(this, "contextMock", {});

    (0, _saferLodashSet.set)(this.contextMock, pathToESclient, {
      callAsCurrentUser: this.callAsCurrentUser.bind(this)
    });
  }

  get({
    path
  }, handler) {
    this.cacheHandlers.get[path] = handler;
  }

  post({
    path
  }, handler) {
    this.cacheHandlers.post[path] = handler;
  }

  put({
    path
  }, handler) {
    this.cacheHandlers.put[path] = handler;
  }

  delete({
    path
  }, handler) {
    this.cacheHandlers.delete[path] = handler;
  }

  patch({
    path
  }, handler) {
    this.cacheHandlers.patch[path] = handler;
  }

  callAsCurrentUser() {
    const index = this._callAsCurrentUserCallCount;
    this._callAsCurrentUserCallCount += 1;
    const response = this._callAsCurrentUserResponses[index];
    return typeof response === 'function' ? Promise.resolve(response()) : Promise.resolve(response);
  }

  set callAsCurrentUserResponses(responses) {
    this._callAsCurrentUserCallCount = 0;
    this._callAsCurrentUserResponses = responses;
  }

  runRequest({
    method,
    path,
    ...mockRequest
  }) {
    const handler = this.cacheHandlers[method][path];

    if (typeof handler !== 'function') {
      throw new Error(`No route handler found for ${method.toUpperCase()} request at "${path}"`);
    }

    return handler(this.contextMock, mockRequest, responseMock);
  }

}

exports.RouterMock = RouterMock;