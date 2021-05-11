"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ESIndexPatternSavedObjectService = void 0;

var _packages = require("./epm/packages");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class ESIndexPatternSavedObjectService {
  async getESIndexPattern(savedObjectsClient, pkgName, datasetPath) {
    const installation = await (0, _packages.getInstallation)({
      savedObjectsClient,
      pkgName
    });
    return installation === null || installation === void 0 ? void 0 : installation.es_index_patterns[datasetPath];
  }

}

exports.ESIndexPatternSavedObjectService = ESIndexPatternSavedObjectService;