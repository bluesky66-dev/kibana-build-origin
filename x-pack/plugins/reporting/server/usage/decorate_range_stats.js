"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decorateRangeStats = void 0;

var _lodash = require("lodash");

var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getForFeature(range, typeKey, featureAvailability, additional) {
  const isAvailable = feature => !!featureAvailability[feature];

  const jobType = range[typeKey] || {
    total: 0,
    ...additional
  }; // merge the additional stats for the jobType

  const filledAdditional = {};

  if (additional) {
    Object.keys(additional).forEach(k => {
      filledAdditional[k] = { ...additional[k],
        ...jobType[k]
      };
    });
  }

  return {
    available: isAvailable(typeKey),
    total: jobType.total,
    ...filledAdditional
  };
}
/*
 * Decorates range stats (stats for last day, last 7 days, etc) with feature
 * availability booleans, and zero-filling for unused features
 *
 * This function builds the result object for all export types found in the
 * Reporting data, even if the type is unknown to this Kibana instance.
 */


const decorateRangeStats = (rangeStats = {}, featureAvailability) => {
  const {
    _all: rangeAll,
    status: rangeStatus,
    statuses: rangeStatusByApp,
    [_constants.PDF_JOB_TYPE]: rangeStatsPdf,
    ...rangeStatsBasic
  } = rangeStats; // combine the known types with any unknown type found in reporting data

  const keysBasic = (0, _lodash.uniq)([_constants.CSV_JOB_TYPE_DEPRECATED, _constants.PNG_JOB_TYPE, ...Object.keys(rangeStatsBasic)]);
  const rangeBasic = keysBasic.reduce((accum, currentKey) => {
    return { ...accum,
      [currentKey]: getForFeature(rangeStatsBasic, currentKey, featureAvailability)
    };
  }, {});
  const rangePdf = {
    [_constants.PDF_JOB_TYPE]: getForFeature(rangeStats, _constants.PDF_JOB_TYPE, featureAvailability, {
      app: {
        dashboard: 0,
        visualization: 0
      },
      layout: {
        preserve_layout: 0,
        print: 0
      }
    })
  };
  const resultStats = {
    _all: rangeAll || 0,
    status: {
      completed: 0,
      failed: 0,
      ...rangeStatus
    },
    statuses: rangeStatusByApp,
    ...rangePdf,
    ...rangeBasic
  };
  return resultStats;
};

exports.decorateRangeStats = decorateRangeStats;