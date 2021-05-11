"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateSampleDocuments = generateSampleDocuments;

var _lodash = require("lodash");

var _uuid = _interopRequireDefault(require("uuid"));

var _collect_data_telemetry = require("../../server/lib/apm_telemetry/collect_data_telemetry");

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


const randomize = (value, instanceVariation, dailyGrowth) => {
  if (typeof value === 'boolean') {
    return Math.random() > 0.5;
  }

  if (typeof value === 'number') {
    return Math.round(instanceVariation * dailyGrowth * value);
  }

  return value;
};

const mapValuesDeep = (obj, iterator) => (0, _lodash.mapValues)(obj, (val, key) => (0, _lodash.isPlainObject)(val) ? mapValuesDeep(val, iterator) : iterator(val, key, obj));

async function generateSampleDocuments(options) {
  const {
    collectTelemetryParams,
    ...preferredOptions
  } = options;
  const opts = (0, _lodash.defaultsDeep)({
    days: 100,
    instances: 50,
    variation: {
      min: 0.1,
      max: 4
    }
  }, preferredOptions);
  const sample = await (0, _collect_data_telemetry.collectDataTelemetry)(collectTelemetryParams);
  console.log('Collected telemetry'); // eslint-disable-line no-console

  console.log('\n' + JSON.stringify(sample, null, 2)); // eslint-disable-line no-console

  const dateOfScriptExecution = new Date();
  return (0, _lodash.flatten)((0, _lodash.range)(0, opts.instances).map(() => {
    const instanceId = _uuid.default.v4();

    const defaults = {
      cluster_uuid: instanceId,
      stack_stats: {
        kibana: {
          versions: {
            version: '8.0.0'
          }
        }
      }
    };
    const instanceVariation = Math.random() * (opts.variation.max - opts.variation.min) + opts.variation.min;
    return (0, _lodash.range)(0, opts.days).map(dayNo => {
      const dailyGrowth = Math.pow(1.005, opts.days - 1 - dayNo);
      const timestamp = Date.UTC(dateOfScriptExecution.getFullYear(), dateOfScriptExecution.getMonth(), -dayNo);
      const generated = mapValuesDeep((0, _lodash.omit)(sample, 'versions'), value => randomize(value, instanceVariation, dailyGrowth));
      return (0, _lodash.merge)({}, defaults, {
        timestamp,
        stack_stats: {
          kibana: {
            plugins: {
              apm: (0, _lodash.merge)({}, sample, generated)
            }
          }
        }
      });
    });
  }));
}