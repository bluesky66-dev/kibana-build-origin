"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createApi = createApi;

var _lodash = require("lodash");

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _configSchema = require("@kbn/config-schema");

var t = _interopRequireWildcard(require("io-ts"));

var _PathReporter = require("io-ts/lib/PathReporter");

var _Either = require("fp-ts/lib/Either");

var _errors = require("@elastic/elasticsearch/lib/errors");

var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));

var _merge = require("../../../common/runtime_types/merge");

var _strict_keys_rt = require("../../../common/runtime_types/strict_keys_rt");

var _json_rt = require("../../../common/runtime_types/json_rt");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const debugRt = t.exact(t.partial({
  query: t.exact(t.partial({
    _debug: _json_rt.jsonRt.pipe(t.boolean)
  }))
}));

const isNotEmpty = val => val !== undefined && val !== null && !((0, _lodash.isPlainObject)(val) && (0, _lodash.isEmpty)(val));

function createApi() {
  const routes = [];
  const api = {
    _S: {},

    add(route) {
      routes.push(route);
      return this;
    },

    init(core, {
      config$,
      logger,
      plugins
    }) {
      const router = core.http.createRouter();
      let config = {};
      config$.subscribe(val => {
        config = val;
      });
      routes.forEach(routeOrFactoryFn => {
        const route = typeof routeOrFactoryFn === 'function' ? routeOrFactoryFn(core) : routeOrFactoryFn;
        const {
          params,
          endpoint,
          options,
          handler
        } = route;
        const [method, path] = endpoint.split(' ');
        const typedRouterMethod = method.trim().toLowerCase();

        if (!['get', 'post', 'put', 'delete'].includes(typedRouterMethod)) {
          throw new Error("Couldn't register route, as endpoint was not prefixed with a valid HTTP method");
        } // For all runtime types with props, we create an exact
        // version that will strip all keys that are unvalidated.


        const paramsRt = params ? (0, _merge.merge)([params, debugRt]) : debugRt;

        const anyObject = _configSchema.schema.object({}, {
          unknowns: 'allow'
        });

        router[typedRouterMethod]({
          path,
          options,
          validate: {
            // `body` can be null, but `validate` expects non-nullable types
            // if any validation is defined. Not having validation currently
            // means we don't get the payload. See
            // https://github.com/elastic/kibana/issues/50179
            body: _configSchema.schema.nullable(anyObject),
            params: anyObject,
            query: anyObject
          }
        }, async (context, request, response) => {
          if (_elasticApmNode.default.isStarted()) {
            _elasticApmNode.default.addLabels({
              plugin: 'apm'
            });
          }

          try {
            const paramMap = (0, _lodash.pickBy)({
              path: request.params,
              body: request.body,
              query: {
                _debug: 'false',
                ...request.query
              }
            }, isNotEmpty);
            const result = (0, _strict_keys_rt.strictKeysRt)(paramsRt).decode(paramMap);

            if ((0, _Either.isLeft)(result)) {
              throw _boom.default.badRequest(_PathReporter.PathReporter.report(result)[0]);
            }

            const data = await handler({
              request,
              context: { ...context,
                plugins,
                // Only return values for parameters that have runtime types,
                // but always include query as _debug is always set even if
                // it's not defined in the route.
                params: (0, _lodash.merge)({
                  query: {
                    _debug: false
                  }
                }, (0, _lodash.pickBy)(result.right, isNotEmpty)),
                config,
                logger
              }
            });
            return response.ok({
              body: data
            });
          } catch (error) {
            if (_boom.default.isBoom(error)) {
              return convertBoomToKibanaResponse(error, response);
            }

            if (error instanceof _errors.RequestAbortedError) {
              return response.custom({
                statusCode: 499,
                body: {
                  message: 'Client closed request'
                }
              });
            }

            throw error;
          }
        });
      });
    }

  };
  return api;
}

function convertBoomToKibanaResponse(error, response) {
  const opts = {
    body: {
      message: error.message
    }
  };

  switch (error.output.statusCode) {
    case 404:
      return response.notFound(opts);

    case 400:
      return response.badRequest(opts);

    case 403:
      return response.forbidden(opts);

    default:
      throw error;
  }
}