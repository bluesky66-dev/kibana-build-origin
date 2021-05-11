"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KqlTelemetryService = void 0;

var _operators = require("rxjs/operators");

var _route = require("./route");

var _usage_collector = require("./usage_collector");

var _saved_objects = require("../saved_objects");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class KqlTelemetryService {
  constructor(initializerContext) {
    this.initializerContext = initializerContext;
  }

  setup({
    http,
    getStartServices,
    savedObjects
  }, {
    usageCollection
  }) {
    savedObjects.registerType(_saved_objects.kqlTelemetry);
    (0, _route.registerKqlTelemetryRoute)(http.createRouter(), getStartServices, this.initializerContext.logger.get('data', 'kql-telemetry'));

    if (usageCollection) {
      this.initializerContext.config.legacy.globalConfig$.pipe((0, _operators.first)()).toPromise().then(config => (0, _usage_collector.makeKQLUsageCollector)(usageCollection, config.kibana.index)).catch(e => {
        this.initializerContext.logger.get('kql-telemetry').warn(`Registering KQL telemetry collector failed: ${e}`);
      });
    }
  }

  start() {}

}

exports.KqlTelemetryService = KqlTelemetryService;