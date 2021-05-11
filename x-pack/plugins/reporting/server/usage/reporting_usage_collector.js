"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReportingUsageCollector = getReportingUsageCollector;
exports.registerReportingUsageCollector = registerReportingUsageCollector;

var _operators = require("rxjs/operators");

var _get_reporting_usage = require("./get_reporting_usage");

var _schema = require("./schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * @return {Object} kibana usage stats type collection object
 */


function getReportingUsageCollector(reporting, usageCollection, getLicense, exportTypesRegistry, isReady) {
  return usageCollection.makeUsageCollector({
    type: 'reporting',
    fetch: ({
      esClient
    }) => {
      const config = reporting.getConfig();
      return (0, _get_reporting_usage.getReportingUsage)(config, getLicense, esClient, exportTypesRegistry);
    },
    isReady,
    schema: _schema.reportingSchema
  });
}

function registerReportingUsageCollector(reporting, {
  licensing,
  usageCollection
}) {
  if (!usageCollection) {
    return;
  }

  const exportTypesRegistry = reporting.getExportTypesRegistry();

  const getLicense = async () => {
    return await licensing.license$.pipe((0, _operators.map)(({
      isAvailable,
      type
    }) => ({
      isAvailable: () => isAvailable,
      license: {
        getType: () => type
      }
    })), (0, _operators.first)()).toPromise();
  };

  const collectionIsReady = reporting.pluginStartsUp.bind(reporting);
  const collector = getReportingUsageCollector(reporting, usageCollection, getLicense, exportTypesRegistry, collectionIsReady);
  usageCollection.registerCollector(collector);
}