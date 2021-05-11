"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CloudPlugin = void 0;

var _collectors = require("./collectors");

var _is_cloud_enabled = require("../common/is_cloud_enabled");

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

class CloudPlugin {
  constructor(context) {
    this.context = context;

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "config", void 0);

    this.logger = this.context.logger.get();
    this.config = this.context.config.get();
  }

  setup(core, {
    usageCollection
  }) {
    var _this$config$apm, _this$config$apm2;

    this.logger.debug('Setting up Cloud plugin');
    const isCloudEnabled = (0, _is_cloud_enabled.getIsCloudEnabled)(this.config.id);
    (0, _collectors.registerCloudUsageCollector)(usageCollection, {
      isCloudEnabled
    });
    return {
      cloudId: this.config.id,
      isCloudEnabled,
      apm: {
        url: (_this$config$apm = this.config.apm) === null || _this$config$apm === void 0 ? void 0 : _this$config$apm.url,
        secretToken: (_this$config$apm2 = this.config.apm) === null || _this$config$apm2 === void 0 ? void 0 : _this$config$apm2.secret_token
      }
    };
  }

  start() {}

}

exports.CloudPlugin = CloudPlugin;