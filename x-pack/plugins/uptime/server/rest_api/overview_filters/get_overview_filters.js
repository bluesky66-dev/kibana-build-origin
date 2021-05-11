"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGetOverviewFilters = void 0;

var _configSchema = require("@kbn/config-schema");

var _helper = require("../../lib/helper");

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const arrayOrStringType = _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())]));

const createGetOverviewFilters = libs => ({
  method: 'GET',
  path: _constants.API_URLS.FILTERS,
  validate: {
    query: _configSchema.schema.object({
      dateRangeStart: _configSchema.schema.string(),
      dateRangeEnd: _configSchema.schema.string(),
      search: _configSchema.schema.maybe(_configSchema.schema.string()),
      locations: arrayOrStringType,
      schemes: arrayOrStringType,
      ports: arrayOrStringType,
      tags: arrayOrStringType,
      _debug: _configSchema.schema.maybe(_configSchema.schema.boolean())
    })
  },
  handler: async ({
    uptimeEsClient,
    request,
    response
  }) => {
    const {
      dateRangeStart,
      dateRangeEnd,
      locations,
      schemes,
      search,
      ports,
      tags
    } = request.query;
    let parsedSearch;

    if (search) {
      try {
        parsedSearch = JSON.parse(search);
      } catch (e) {
        return response.badRequest({
          body: {
            message: e.message
          }
        });
      }
    }

    return await libs.requests.getFilterBar({
      uptimeEsClient,
      dateRangeStart,
      dateRangeEnd,
      search: parsedSearch,
      filterOptions: (0, _helper.objectValuesToArrays)({
        locations,
        ports,
        schemes,
        tags
      })
    });
  }
});

exports.createGetOverviewFilters = createGetOverviewFilters;