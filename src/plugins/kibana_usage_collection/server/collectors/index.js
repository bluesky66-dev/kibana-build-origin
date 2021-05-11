"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "registerUiMetricUsageCollector", {
  enumerable: true,
  get: function () {
    return _ui_metric.registerUiMetricUsageCollector;
  }
});
Object.defineProperty(exports, "registerManagementUsageCollector", {
  enumerable: true,
  get: function () {
    return _management.registerManagementUsageCollector;
  }
});
Object.defineProperty(exports, "registerApplicationUsageCollector", {
  enumerable: true,
  get: function () {
    return _application_usage.registerApplicationUsageCollector;
  }
});
Object.defineProperty(exports, "registerKibanaUsageCollector", {
  enumerable: true,
  get: function () {
    return _kibana.registerKibanaUsageCollector;
  }
});
Object.defineProperty(exports, "registerOpsStatsCollector", {
  enumerable: true,
  get: function () {
    return _ops_stats.registerOpsStatsCollector;
  }
});
Object.defineProperty(exports, "registerCspCollector", {
  enumerable: true,
  get: function () {
    return _csp.registerCspCollector;
  }
});
Object.defineProperty(exports, "registerCoreUsageCollector", {
  enumerable: true,
  get: function () {
    return _core.registerCoreUsageCollector;
  }
});
Object.defineProperty(exports, "registerLocalizationUsageCollector", {
  enumerable: true,
  get: function () {
    return _localization.registerLocalizationUsageCollector;
  }
});
Object.defineProperty(exports, "registerUiCountersUsageCollector", {
  enumerable: true,
  get: function () {
    return _ui_counters.registerUiCountersUsageCollector;
  }
});
Object.defineProperty(exports, "registerUiCounterSavedObjectType", {
  enumerable: true,
  get: function () {
    return _ui_counters.registerUiCounterSavedObjectType;
  }
});
Object.defineProperty(exports, "registerUiCountersRollups", {
  enumerable: true,
  get: function () {
    return _ui_counters.registerUiCountersRollups;
  }
});

var _ui_metric = require("./ui_metric");

var _management = require("./management");

var _application_usage = require("./application_usage");

var _kibana = require("./kibana");

var _ops_stats = require("./ops_stats");

var _csp = require("./csp");

var _core = require("./core");

var _localization = require("./localization");

var _ui_counters = require("./ui_counters");