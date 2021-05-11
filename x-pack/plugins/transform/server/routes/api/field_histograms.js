"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerFieldHistogramsRoutes = registerFieldHistogramsRoutes;

var _common = require("../../../common/api_schemas/common");

var _field_histograms = require("../../../common/api_schemas/field_histograms");

var _shared_imports = require("../../shared_imports");

var _index = require("../index");

var _error_utils = require("./error_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerFieldHistogramsRoutes({
  router,
  license
}) {
  router.post({
    path: (0, _index.addBasePath)('field_histograms/{indexPatternTitle}'),
    validate: {
      params: _common.indexPatternTitleSchema,
      body: _field_histograms.fieldHistogramsRequestSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      indexPatternTitle
    } = req.params;
    const {
      query,
      fields,
      runtimeMappings,
      samplerShardSize
    } = req.body;

    try {
      const resp = await (0, _shared_imports.getHistogramsForFields)(ctx.core.elasticsearch.client, indexPatternTitle, query, fields, samplerShardSize, runtimeMappings);
      return res.ok({
        body: resp
      });
    } catch (e) {
      return res.customError((0, _error_utils.wrapError)((0, _error_utils.wrapEsError)(e)));
    }
  }));
}