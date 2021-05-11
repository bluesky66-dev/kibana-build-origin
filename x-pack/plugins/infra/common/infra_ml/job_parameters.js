"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterDatasetFilter = exports.combineDatasetFilters = exports.jobCustomSettingsRT = exports.jobSourceConfigurationRT = exports.datasetFilterRT = exports.getDatafeedId = exports.getJobId = exports.getJobIdPrefix = exports.partitionField = exports.categoriesMessageField = exports.bucketSpan = void 0;

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


const bucketSpan = 900000;
exports.bucketSpan = bucketSpan;
const categoriesMessageField = 'message';
exports.categoriesMessageField = categoriesMessageField;
const partitionField = 'event.dataset';
exports.partitionField = partitionField;

const getJobIdPrefix = (spaceId, sourceId) => `kibana-metrics-ui-${spaceId}-${sourceId}-`;

exports.getJobIdPrefix = getJobIdPrefix;

const getJobId = (spaceId, sourceId, jobType) => `${getJobIdPrefix(spaceId, sourceId)}${jobType}`;

exports.getJobId = getJobId;

const getDatafeedId = (spaceId, sourceId, jobType) => `datafeed-${getJobId(spaceId, sourceId, jobType)}`;

exports.getDatafeedId = getDatafeedId;
const datasetFilterRT = rt.union([rt.strict({
  type: rt.literal('includeAll')
}), rt.strict({
  type: rt.literal('includeSome'),
  datasets: rt.array(rt.string)
})]);
exports.datasetFilterRT = datasetFilterRT;
const jobSourceConfigurationRT = rt.partial({
  indexPattern: rt.string,
  timestampField: rt.string,
  bucketSpan: rt.number,
  datasetFilter: datasetFilterRT
});
exports.jobSourceConfigurationRT = jobSourceConfigurationRT;
const jobCustomSettingsRT = rt.partial({
  job_revision: rt.number,
  metrics_source_config: jobSourceConfigurationRT
});
exports.jobCustomSettingsRT = jobCustomSettingsRT;

const combineDatasetFilters = (firstFilter, secondFilter) => {
  if (firstFilter.type === 'includeAll' && secondFilter.type === 'includeAll') {
    return {
      type: 'includeAll'
    };
  }

  const includedDatasets = new Set([...(firstFilter.type === 'includeSome' ? firstFilter.datasets : []), ...(secondFilter.type === 'includeSome' ? secondFilter.datasets : [])]);
  return {
    type: 'includeSome',
    datasets: [...includedDatasets]
  };
};

exports.combineDatasetFilters = combineDatasetFilters;

const filterDatasetFilter = (datasetFilter, predicate) => {
  if (datasetFilter.type === 'includeAll') {
    return datasetFilter;
  } else {
    const newDatasets = datasetFilter.datasets.filter(predicate);

    if (newDatasets.length > 0) {
      return {
        type: 'includeSome',
        datasets: newDatasets
      };
    } else {
      return {
        type: 'includeAll'
      };
    }
  }
};

exports.filterDatasetFilter = filterDatasetFilter;