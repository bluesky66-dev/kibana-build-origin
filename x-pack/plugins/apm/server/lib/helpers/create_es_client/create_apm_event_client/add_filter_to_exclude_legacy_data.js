"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addFilterToExcludeLegacyData = addFilterToExcludeLegacyData;

var _lodash = require("lodash");

var _elasticsearch_fieldnames = require("../../../../../common/elasticsearch_fieldnames");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
  Adds a range query to the ES request to exclude legacy data
*/


function addFilterToExcludeLegacyData(params) {
  const nextParams = (0, _lodash.cloneDeep)(params); // add filter for omitting pre-7.x data

  nextParams.body.query.bool.filter.push({
    range: {
      [_elasticsearch_fieldnames.OBSERVER_VERSION_MAJOR]: {
        gte: 7
      }
    }
  });
  return nextParams;
}