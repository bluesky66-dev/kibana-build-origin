"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchProvider = searchProvider;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _index_patterns = require("../../../common/constants/index_patterns");

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


function searchProvider(client, jobSavedObjectService) {
  async function jobIdsCheck(jobType, jobIds) {
    if (jobIds.length) {
      const filteredJobIds = await jobSavedObjectService.filterJobIdsForSpace(jobType, jobIds);
      const missingIds = jobIds.filter(j => filteredJobIds.indexOf(j) === -1);

      if (missingIds.length) {
        throw _boom.default.notFound(`${missingIds.join(',')} missing`);
      }
    }
  }

  async function anomalySearch(searchParams, jobIds) {
    await jobIdsCheck('anomaly-detector', jobIds);
    const {
      asInternalUser
    } = client;
    const resp = await asInternalUser.search({ ...searchParams,
      index: _index_patterns.ML_RESULTS_INDEX_PATTERN
    });
    return resp;
  }

  return {
    anomalySearch
  };
}