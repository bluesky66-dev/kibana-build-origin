"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getResultsServiceProvider = getResultsServiceProvider;

var _results_service = require("../../models/results_service");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getResultsServiceProvider(getGuards) {
  return {
    resultsServiceProvider(request, savedObjectsClient) {
      return {
        async getAnomaliesTableData(...args) {
          return await getGuards(request, savedObjectsClient).isFullLicense().hasMlCapabilities(['canGetJobs']).ok(async ({
            mlClient
          }) => {
            const {
              getAnomaliesTableData
            } = (0, _results_service.resultsServiceProvider)(mlClient);
            return getAnomaliesTableData(...args);
          });
        }

      };
    }

  };
}