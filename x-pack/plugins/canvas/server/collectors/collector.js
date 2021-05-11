"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCanvasUsageCollector = registerCanvasUsageCollector;

var _workpad_collector = require("./workpad_collector");

var _custom_element_collector = require("./custom_element_collector");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const collectors = [_workpad_collector.workpadCollector, _custom_element_collector.customElementCollector];
/*
  Register the canvas usage collector function

  This will call all of the defined collectors and combine the individual results into a single object
  to be returned to the caller.

  A usage collector function returns an object derived from current data in the ES Cluster.
*/

function registerCanvasUsageCollector(usageCollection, kibanaIndex) {
  if (!usageCollection) {
    return;
  }

  const canvasCollector = usageCollection.makeUsageCollector({
    type: 'canvas',
    isReady: () => true,
    fetch: async ({
      esClient
    }) => {
      const collectorResults = await Promise.all(collectors.map(collector => collector(kibanaIndex, esClient)));
      return collectorResults.reduce((reduction, usage) => {
        return { ...reduction,
          ...usage
        };
      }, {}); // We need the casting because `TelemetryCollector` claims it returns `Record<string, any>`
    },
    schema: { ..._workpad_collector.workpadSchema,
      ..._custom_element_collector.customElementSchema
    }
  });
  usageCollection.registerCollector(canvasCollector);
}