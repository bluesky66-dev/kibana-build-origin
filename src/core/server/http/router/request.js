"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isKibanaRequest = isKibanaRequest;
exports.isRealRequest = isRealRequest;
exports.ensureRawRequest = exports.KibanaRequest = void 0;

var _uuid = _interopRequireDefault(require("uuid"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _std = require("@kbn/std");

var _route = require("./route");

var _socket = require("./socket");

var _validator = require("./validator");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const requestSymbol = Symbol('request');
/**
 * @internal
 */

// eslint-disable-line @typescript-eslint/no-empty-interface

/**
 * Kibana specific abstraction for an incoming request.
 * @public
 */
class KibanaRequest {
  /**
   * Factory for creating requests. Validates the request before creating an
   * instance of a KibanaRequest.
   * @internal
   */
  static from(req, routeSchemas = {}, withoutSecretHeaders = true) {
    const routeValidator = _validator.RouteValidator.from(routeSchemas);

    const requestParts = KibanaRequest.validate(req, routeValidator);
    return new KibanaRequest(req, requestParts.params, requestParts.query, requestParts.body, withoutSecretHeaders);
  }
  /**
   * Validates the different parts of a request based on the schemas defined for
   * the route. Builds up the actual params, query and body object that will be
   * received in the route handler.
   * @internal
   */


  static validate(req, routeValidator) {
    const params = routeValidator.getParams(req.params, 'request params');
    const query = routeValidator.getQuery(req.query, 'request query');
    const body = routeValidator.getBody(req.payload, 'request body');
    return {
      query,
      params,
      body
    };
  }
  /**
   * A identifier to identify this request.
   *
   * @remarks
   * Depending on the user's configuration, this value may be sourced from the
   * incoming request's `X-Opaque-Id` header which is not guaranteed to be unique
   * per request.
   */


  constructor(request, params, query, body, withoutSecretHeaders) {
    var _appState$requestId, _appState$requestUuid, _request$auth;

    this.params = params;
    this.query = query;
    this.body = body;
    this.withoutSecretHeaders = withoutSecretHeaders;

    _defineProperty(this, "id", void 0);

    _defineProperty(this, "uuid", void 0);

    _defineProperty(this, "url", void 0);

    _defineProperty(this, "route", void 0);

    _defineProperty(this, "headers", void 0);

    _defineProperty(this, "isSystemRequest", void 0);

    _defineProperty(this, "socket", void 0);

    _defineProperty(this, "events", void 0);

    _defineProperty(this, "auth", void 0);

    _defineProperty(this, "rewrittenUrl", void 0);

    _defineProperty(this, requestSymbol, void 0);

    // The `requestId` and `requestUuid` properties will not be populated for requests that are 'faked' by internal systems that leverage
    // KibanaRequest in conjunction with scoped Elasticsearch and SavedObjectsClient in order to pass credentials.
    // In these cases, the ids default to a newly generated UUID.
    const appState = request.app;
    this.id = (_appState$requestId = appState === null || appState === void 0 ? void 0 : appState.requestId) !== null && _appState$requestId !== void 0 ? _appState$requestId : _uuid.default.v4();
    this.uuid = (_appState$requestUuid = appState === null || appState === void 0 ? void 0 : appState.requestUuid) !== null && _appState$requestUuid !== void 0 ? _appState$requestUuid : _uuid.default.v4();
    this.rewrittenUrl = appState === null || appState === void 0 ? void 0 : appState.rewrittenUrl;
    this.url = request.url;
    this.headers = (0, _std.deepFreeze)({ ...request.headers
    });
    this.isSystemRequest = request.headers['kbn-system-request'] === 'true' || // Remove support for `kbn-system-api` in 8.x. Used only by legacy platform.
    request.headers['kbn-system-api'] === 'true'; // prevent Symbol exposure via Object.getOwnPropertySymbols()

    Object.defineProperty(this, requestSymbol, {
      value: request,
      enumerable: false
    });
    this.route = (0, _std.deepFreeze)(this.getRouteInfo(request));
    this.socket = new _socket.KibanaSocket(request.raw.req.socket);
    this.events = this.getEvents(request);
    this.auth = {
      // missing in fakeRequests, so we cast to false
      isAuthenticated: Boolean((_request$auth = request.auth) === null || _request$auth === void 0 ? void 0 : _request$auth.isAuthenticated)
    };
  }

  getEvents(request) {
    const finish$ = (0, _rxjs.merge)((0, _rxjs.fromEvent)(request.raw.res, 'finish'), // Response has been sent
    (0, _rxjs.fromEvent)(request.raw.req, 'close') // connection was closed
    ).pipe((0, _operators.shareReplay)(1), (0, _operators.first)());
    const aborted$ = (0, _rxjs.fromEvent)(request.raw.req, 'aborted').pipe((0, _operators.first)(), (0, _operators.takeUntil)(finish$));
    const completed$ = (0, _rxjs.merge)(finish$, aborted$).pipe((0, _operators.shareReplay)(1), (0, _operators.first)());
    return {
      aborted$,
      completed$
    };
  }

  getRouteInfo(request) {
    var _request$raw$req$sock, _xsrfRequired, _app;

    const method = request.method;
    const {
      parse,
      maxBytes,
      allow,
      output,
      timeout: payloadTimeout
    } = request.route.settings.payload || {}; // net.Socket#timeout isn't documented, yet, and isn't part of the types... https://github.com/nodejs/node/pull/34543
    // the socket is also undefined when using @hapi/shot, or when a "fake request" is used

    const socketTimeout = (_request$raw$req$sock = request.raw.req.socket) === null || _request$raw$req$sock === void 0 ? void 0 : _request$raw$req$sock.timeout;
    const options = {
      authRequired: this.getAuthRequired(request),
      // TypeScript note: Casting to `RouterOptions` to fix the following error:
      //
      //     Property 'app' does not exist on type 'RouteSettings'
      //
      // In @types/hapi__hapi v18, `request.route.settings` is of type
      // `RouteSettings`, which doesn't have an `app` property. I think this is
      // a mistake. In v19, the `RouteSettings` interface does have an `app`
      // property.
      xsrfRequired: (_xsrfRequired = (_app = request.route.settings.app) === null || _app === void 0 ? void 0 : _app.xsrfRequired) !== null && _xsrfRequired !== void 0 ? _xsrfRequired : true,
      // some places in LP call KibanaRequest.from(request) manually. remove fallback to true before v8
      tags: request.route.settings.tags || [],
      timeout: {
        payload: payloadTimeout,
        idleSocket: socketTimeout === 0 ? undefined : socketTimeout
      },
      body: (0, _route.isSafeMethod)(method) ? undefined : {
        parse,
        maxBytes,
        accepts: allow,
        output: output // We do not support all the HAPI-supported outputs and TS complains

      }
    }; // TS does not understand this is OK so I'm enforced to do this enforced casting

    return {
      path: request.path,
      method,
      options
    };
  }

  getAuthRequired(request) {
    const authOptions = request.route.settings.auth;

    if (typeof authOptions === 'object') {
      // 'try' is used in the legacy platform
      if (authOptions.mode === 'optional' || authOptions.mode === 'try') {
        return 'optional';
      }

      if (authOptions.mode === 'required') {
        return true;
      }
    } // legacy platform routes


    if (authOptions === undefined) {
      return true;
    } // @ts-expect-error According to @types/hapi__hapi, `route.settings` should be of type `RouteSettings`, but it seems that it's actually `RouteOptions` (https://github.com/hapijs/hapi/blob/v18.4.2/lib/route.js#L139)


    if (authOptions === false) return false;
    throw new Error(`unexpected authentication options: ${JSON.stringify(authOptions)} for route: ${this.url.pathname}${this.url.search}`);
  }

}
/**
 * Returns underlying Hapi Request
 * @internal
 */


exports.KibanaRequest = KibanaRequest;

const ensureRawRequest = request => isKibanaRequest(request) ? request[requestSymbol] : request;
/**
 * Checks if an incoming request is a {@link KibanaRequest}
 * @internal
 */


exports.ensureRawRequest = ensureRawRequest;

function isKibanaRequest(request) {
  return request instanceof KibanaRequest;
}

function isRequest(request) {
  try {
    return request.raw.req && typeof request.raw.req === 'object';
  } catch {
    return false;
  }
}
/**
 * Checks if an incoming request either KibanaRequest or Legacy.Request
 * @internal
 */


function isRealRequest(request) {
  return isKibanaRequest(request) || isRequest(request);
}