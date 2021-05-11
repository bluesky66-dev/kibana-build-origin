"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggregateAlertRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _license_api_access = require("../lib/license_api_access");

var _common = require("../../common");

var _rename_keys = require("./lib/rename_keys");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// config definition


const querySchema = _configSchema.schema.object({
  search: _configSchema.schema.maybe(_configSchema.schema.string()),
  default_search_operator: _configSchema.schema.oneOf([_configSchema.schema.literal('OR'), _configSchema.schema.literal('AND')], {
    defaultValue: 'OR'
  }),
  search_fields: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.arrayOf(_configSchema.schema.string()), _configSchema.schema.string()])),
  has_reference: _configSchema.schema.maybe( // use nullable as maybe is currently broken
  // in config-schema
  _configSchema.schema.nullable(_configSchema.schema.object({
    type: _configSchema.schema.string(),
    id: _configSchema.schema.string()
  }))),
  filter: _configSchema.schema.maybe(_configSchema.schema.string())
});

const aggregateAlertRoute = (router, licenseState) => {
  router.get({
    path: `${_common.BASE_ALERT_API_PATH}/_aggregate`,
    validate: {
      query: querySchema
    }
  }, router.handleLegacyErrors(async function (context, req, res) {
    (0, _license_api_access.verifyApiAccess)(licenseState);

    if (!context.alerting) {
      return res.badRequest({
        body: 'RouteHandlerContext is not registered for alerting'
      });
    }

    const alertsClient = context.alerting.getAlertsClient();
    const query = req.query;
    const renameMap = {
      default_search_operator: 'defaultSearchOperator',
      has_reference: 'hasReference',
      search: 'search',
      filter: 'filter'
    };
    const options = (0, _rename_keys.renameKeys)(renameMap, query);

    if (query.search_fields) {
      options.searchFields = Array.isArray(query.search_fields) ? query.search_fields : [query.search_fields];
    }

    const aggregateResult = await alertsClient.aggregate({
      options
    });
    return res.ok({
      body: aggregateResult
    });
  }));
};

exports.aggregateAlertRoute = aggregateAlertRoute;