"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerAnnotationAPIs = registerAnnotationAPIs;

var t = _interopRequireWildcard(require("io-ts"));

var _configSchema = require("@kbn/config-schema");

var _PathReporter = require("io-ts/lib/PathReporter");

var _Either = require("fp-ts/lib/Either");

var _annotations = require("../../../common/annotations");

var _create_annotations_client = require("./create_annotations_client");

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
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const unknowns = _configSchema.schema.object({}, {
  unknowns: 'allow'
});

function registerAnnotationAPIs({
  core,
  index,
  logger
}) {
  function wrapRouteHandler(types, handler) {
    return async (...args) => {
      var _context$licensing;

      const [context, request, response] = args;
      const rt = types;
      const data = {
        body: request.body,
        query: request.query,
        params: request.params
      };
      const validation = rt.decode(data);

      if ((0, _Either.isLeft)(validation)) {
        return response.badRequest({
          body: _PathReporter.PathReporter.report(validation).join(', ')
        });
      }

      const esClient = context.core.elasticsearch.client.asCurrentUser;
      const client = (0, _create_annotations_client.createAnnotationsClient)({
        index,
        esClient,
        logger,
        license: (_context$licensing = context.licensing) === null || _context$licensing === void 0 ? void 0 : _context$licensing.license
      });

      try {
        const res = await handler({
          data: validation.right,
          client
        });
        return response.ok({
          body: res
        });
      } catch (err) {
        var _err$output$statusCod, _err$output, _err$output$payload$m, _err$output2, _err$output2$payload;

        return response.custom({
          statusCode: (_err$output$statusCod = (_err$output = err.output) === null || _err$output === void 0 ? void 0 : _err$output.statusCode) !== null && _err$output$statusCod !== void 0 ? _err$output$statusCod : 500,
          body: {
            message: (_err$output$payload$m = (_err$output2 = err.output) === null || _err$output2 === void 0 ? void 0 : (_err$output2$payload = _err$output2.payload) === null || _err$output2$payload === void 0 ? void 0 : _err$output2$payload.message) !== null && _err$output$payload$m !== void 0 ? _err$output$payload$m : 'An internal server error occured'
          }
        });
      }
    };
  }

  const router = core.http.createRouter();
  router.post({
    path: '/api/observability/annotation',
    validate: {
      body: unknowns
    }
  }, wrapRouteHandler(t.type({
    body: _annotations.createAnnotationRt
  }), ({
    data,
    client
  }) => {
    return client.create(data.body);
  }));
  router.delete({
    path: '/api/observability/annotation/{id}',
    validate: {
      params: unknowns
    }
  }, wrapRouteHandler(t.type({
    params: _annotations.deleteAnnotationRt
  }), ({
    data,
    client
  }) => {
    return client.delete(data.params);
  }));
  router.get({
    path: '/api/observability/annotation/{id}',
    validate: {
      params: unknowns
    }
  }, wrapRouteHandler(t.type({
    params: _annotations.getAnnotationByIdRt
  }), ({
    data,
    client
  }) => {
    return client.getById(data.params);
  }));
}