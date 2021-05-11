"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlertingBuiltinsPlugin = void 0;

var _alert_types = require("./alert_types");

var _feature = require("./feature");

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class AlertingBuiltinsPlugin {
  constructor(ctx) {
    _defineProperty(this, "logger", void 0);

    this.logger = ctx.logger.get();
  }

  setup(core, {
    alerts,
    features
  }) {
    features.registerKibanaFeature(_feature.BUILT_IN_ALERTS_FEATURE);
    (0, _alert_types.registerBuiltInAlertTypes)({
      logger: this.logger,
      data: core.getStartServices().then(async ([, {
        triggersActionsUi
      }]) => triggersActionsUi.data),
      alerts
    });
  }

  start() {}

  stop() {}

}

exports.AlertingBuiltinsPlugin = AlertingBuiltinsPlugin;