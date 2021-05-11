"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ConfigSchema", {
  enumerable: true,
  get: function () {
    return _schema.ConfigSchema;
  }
});
Object.defineProperty(exports, "ReportingConfigType", {
  enumerable: true,
  get: function () {
    return _schema.ReportingConfigType;
  }
});
Object.defineProperty(exports, "buildConfig", {
  enumerable: true,
  get: function () {
    return _config.buildConfig;
  }
});
Object.defineProperty(exports, "registerUiSettings", {
  enumerable: true,
  get: function () {
    return _ui_settings.registerUiSettings;
  }
});
exports.config = void 0;

var _lodash = require("lodash");

var _schema = require("./schema");

var _config = require("./config");

var _ui_settings = require("./ui_settings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const config = {
  exposeToBrowser: {
    poll: true
  },
  schema: _schema.ConfigSchema,
  deprecations: ({
    unused
  }) => [unused('capture.browser.chromium.maxScreenshotDimension'), unused('capture.concurrency'), unused('capture.settleTime'), unused('capture.timeout'), unused('poll.jobCompletionNotifier.intervalErrorMultiplier'), unused('poll.jobsRefresh.intervalErrorMultiplier'), unused('kibanaApp'), (settings, fromPath, log) => {
    const reporting = (0, _lodash.get)(settings, fromPath);

    if (reporting !== null && reporting !== void 0 && reporting.index) {
      log(`"${fromPath}.index" is deprecated. Multitenancy by changing "kibana.index" will not be supported starting in 8.0. See https://ela.st/kbn-remove-legacy-multitenancy for more details`);
    }

    return settings;
  }]
};
exports.config = config;