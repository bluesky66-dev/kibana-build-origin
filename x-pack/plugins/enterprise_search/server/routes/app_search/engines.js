"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerEnginesRoutes = registerEnginesRoutes;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerEnginesRoutes({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/api/app_search/engines',
    validate: {
      query: _configSchema.schema.object({
        type: _configSchema.schema.oneOf([_configSchema.schema.literal('indexed'), _configSchema.schema.literal('meta')]),
        pageIndex: _configSchema.schema.number()
      })
    }
  }, async (context, request, response) => {
    const {
      type,
      pageIndex
    } = request.query;
    return enterpriseSearchRequestHandler.createRequest({
      path: '/as/engines/collection',
      params: {
        type,
        'page[current]': pageIndex,
        'page[size]': _constants.ENGINES_PAGE_SIZE
      },
      hasValidData: body => {
        var _body$meta, _body$meta$page;

        return Array.isArray(body === null || body === void 0 ? void 0 : body.results) && typeof (body === null || body === void 0 ? void 0 : (_body$meta = body.meta) === null || _body$meta === void 0 ? void 0 : (_body$meta$page = _body$meta.page) === null || _body$meta$page === void 0 ? void 0 : _body$meta$page.total_results) === 'number';
      }
    })(context, request, response);
  }); // Single engine endpoints

  router.get({
    path: '/api/app_search/engines/{name}',
    validate: {
      params: _configSchema.schema.object({
        name: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:name/details'
  }));
  router.get({
    path: '/api/app_search/engines/{name}/overview',
    validate: {
      params: _configSchema.schema.object({
        name: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:name/overview_metrics'
  }));
}