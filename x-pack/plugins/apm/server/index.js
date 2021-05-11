"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeConfigs = mergeConfigs;
Object.defineProperty(exports, "APMPlugin", {
  enumerable: true,
  get: function () {
    return _plugin.APMPlugin;
  }
});
Object.defineProperty(exports, "APMPluginSetup", {
  enumerable: true,
  get: function () {
    return _plugin.APMPluginSetup;
  }
});
exports.plugin = exports.config = void 0;

var _configSchema = require("@kbn/config-schema");

var _plugin = require("./plugin");

var _aggregated_transactions = require("../common/aggregated_transactions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// plugin config


const config = {
  exposeToBrowser: {
    serviceMapEnabled: true,
    ui: true
  },
  schema: _configSchema.schema.object({
    enabled: _configSchema.schema.boolean({
      defaultValue: true
    }),
    serviceMapEnabled: _configSchema.schema.boolean({
      defaultValue: true
    }),
    serviceMapFingerprintBucketSize: _configSchema.schema.number({
      defaultValue: 100
    }),
    serviceMapTraceIdBucketSize: _configSchema.schema.number({
      defaultValue: 65
    }),
    serviceMapFingerprintGlobalBucketSize: _configSchema.schema.number({
      defaultValue: 1000
    }),
    serviceMapTraceIdGlobalBucketSize: _configSchema.schema.number({
      defaultValue: 6
    }),
    serviceMapMaxTracesPerRequest: _configSchema.schema.number({
      defaultValue: 50
    }),
    autocreateApmIndexPattern: _configSchema.schema.boolean({
      defaultValue: true
    }),
    ui: _configSchema.schema.object({
      enabled: _configSchema.schema.boolean({
        defaultValue: true
      }),
      transactionGroupBucketSize: _configSchema.schema.number({
        defaultValue: 1000
      }),
      maxTraceItems: _configSchema.schema.number({
        defaultValue: 1000
      })
    }),
    searchAggregatedTransactions: _configSchema.schema.oneOf([_configSchema.schema.literal(_aggregated_transactions.SearchAggregatedTransactionSetting.auto), _configSchema.schema.literal(_aggregated_transactions.SearchAggregatedTransactionSetting.always), _configSchema.schema.literal(_aggregated_transactions.SearchAggregatedTransactionSetting.never)], {
      defaultValue: _aggregated_transactions.SearchAggregatedTransactionSetting.never
    }),
    telemetryCollectionEnabled: _configSchema.schema.boolean({
      defaultValue: true
    }),
    metricsInterval: _configSchema.schema.number({
      defaultValue: 30
    }),
    maxServiceEnvironments: _configSchema.schema.number({
      defaultValue: 100
    }),
    maxServiceSelection: _configSchema.schema.number({
      defaultValue: 50
    })
  })
};
exports.config = config; // plugin config and ui indices settings

function mergeConfigs(apmOssConfig, apmConfig) {
  const mergedConfig = {
    /* eslint-disable @typescript-eslint/naming-convention */
    // TODO: Remove all apm_oss options by 8.0
    'apm_oss.transactionIndices': apmOssConfig.transactionIndices,
    'apm_oss.spanIndices': apmOssConfig.spanIndices,
    'apm_oss.errorIndices': apmOssConfig.errorIndices,
    'apm_oss.metricsIndices': apmOssConfig.metricsIndices,
    'apm_oss.sourcemapIndices': apmOssConfig.sourcemapIndices,
    'apm_oss.onboardingIndices': apmOssConfig.onboardingIndices,
    'apm_oss.indexPattern': apmOssConfig.indexPattern,
    // TODO: add data stream indices: traces-apm*,logs-apm*,metrics-apm*. Blocked by https://github.com/elastic/kibana/issues/87851

    /* eslint-enable @typescript-eslint/naming-convention */
    'xpack.apm.serviceMapEnabled': apmConfig.serviceMapEnabled,
    'xpack.apm.serviceMapFingerprintBucketSize': apmConfig.serviceMapFingerprintBucketSize,
    'xpack.apm.serviceMapTraceIdBucketSize': apmConfig.serviceMapTraceIdBucketSize,
    'xpack.apm.serviceMapFingerprintGlobalBucketSize': apmConfig.serviceMapFingerprintGlobalBucketSize,
    'xpack.apm.serviceMapTraceIdGlobalBucketSize': apmConfig.serviceMapTraceIdGlobalBucketSize,
    'xpack.apm.serviceMapMaxTracesPerRequest': apmConfig.serviceMapMaxTracesPerRequest,
    'xpack.apm.ui.enabled': apmConfig.ui.enabled,
    'xpack.apm.maxServiceEnvironments': apmConfig.maxServiceEnvironments,
    'xpack.apm.maxServiceSelection': apmConfig.maxServiceSelection,
    'xpack.apm.ui.maxTraceItems': apmConfig.ui.maxTraceItems,
    'xpack.apm.ui.transactionGroupBucketSize': apmConfig.ui.transactionGroupBucketSize,
    'xpack.apm.autocreateApmIndexPattern': apmConfig.autocreateApmIndexPattern,
    'xpack.apm.telemetryCollectionEnabled': apmConfig.telemetryCollectionEnabled,
    'xpack.apm.searchAggregatedTransactions': apmConfig.searchAggregatedTransactions,
    'xpack.apm.metricsInterval': apmConfig.metricsInterval
  };

  if (apmOssConfig.fleetMode) {
    mergedConfig['apm_oss.transactionIndices'] = `traces-apm*,${mergedConfig['apm_oss.transactionIndices']}`;
    mergedConfig['apm_oss.spanIndices'] = `traces-apm*,${mergedConfig['apm_oss.spanIndices']}`;
    mergedConfig['apm_oss.errorIndices'] = `logs-apm*,${mergedConfig['apm_oss.errorIndices']}`;
    mergedConfig['apm_oss.metricsIndices'] = `metrics-apm*,${mergedConfig['apm_oss.metricsIndices']}`;
  }

  return mergedConfig;
}

const plugin = initContext => new _plugin.APMPlugin(initContext);

exports.plugin = plugin;