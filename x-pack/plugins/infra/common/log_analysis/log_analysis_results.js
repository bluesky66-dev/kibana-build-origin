"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.paginationRT = exports.paginationCursorRT = exports.sortRT = exports.compareDatasetsByMaximumAnomalyScore = exports.getFriendlyNameForPartitionId = exports.formatOneDecimalPlace = exports.getSeverityCategoryForScore = exports.ML_SEVERITY_COLORS = exports.ML_SEVERITY_SCORES = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

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


const ML_SEVERITY_SCORES = {
  warning: 3,
  minor: 25,
  major: 50,
  critical: 75
};
exports.ML_SEVERITY_SCORES = ML_SEVERITY_SCORES;
const ML_SEVERITY_COLORS = {
  critical: 'rgb(228, 72, 72)',
  major: 'rgb(229, 113, 0)',
  minor: 'rgb(255, 221, 0)',
  warning: 'rgb(125, 180, 226)'
};
exports.ML_SEVERITY_COLORS = ML_SEVERITY_COLORS;

const getSeverityCategoryForScore = score => {
  if (score >= ML_SEVERITY_SCORES.critical) {
    return 'critical';
  } else if (score >= ML_SEVERITY_SCORES.major) {
    return 'major';
  } else if (score >= ML_SEVERITY_SCORES.minor) {
    return 'minor';
  } else if (score >= ML_SEVERITY_SCORES.warning) {
    return 'warning';
  } else {
    // Category is too low to include
    return undefined;
  }
};

exports.getSeverityCategoryForScore = getSeverityCategoryForScore;

const formatOneDecimalPlace = number => {
  return Math.round(number * 10) / 10;
};

exports.formatOneDecimalPlace = formatOneDecimalPlace;

const getFriendlyNameForPartitionId = partitionId => {
  return partitionId !== '' ? partitionId : 'unknown';
};

exports.getFriendlyNameForPartitionId = getFriendlyNameForPartitionId;

const compareDatasetsByMaximumAnomalyScore = (firstDataset, secondDataset) => firstDataset.maximumAnomalyScore - secondDataset.maximumAnomalyScore; // Generic Sort


exports.compareDatasetsByMaximumAnomalyScore = compareDatasetsByMaximumAnomalyScore;
const sortDirectionsRT = rt.keyof({
  asc: null,
  desc: null
});

const sortRT = fields => rt.type({
  field: fields,
  direction: sortDirectionsRT
}); // Pagination
// [Sort field value, tiebreaker value]


exports.sortRT = sortRT;
const paginationCursorRT = rt.tuple([rt.union([rt.string, rt.number]), rt.union([rt.string, rt.number])]);
exports.paginationCursorRT = paginationCursorRT;
const paginationPreviousPageCursorRT = rt.type({
  searchBefore: paginationCursorRT
});
const paginationNextPageCursorRT = rt.type({
  searchAfter: paginationCursorRT
});
const paginationRT = rt.intersection([rt.type({
  pageSize: rt.number
}), rt.partial({
  cursor: rt.union([paginationPreviousPageCursorRT, paginationNextPageCursorRT])
})]);
exports.paginationRT = paginationRT;