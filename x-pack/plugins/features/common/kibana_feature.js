"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KibanaFeature = void 0;

var _sub_feature = require("./sub_feature");

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

class KibanaFeature {
  constructor(config) {
    var _config$subFeatures;

    this.config = config;

    _defineProperty(this, "subFeatures", void 0);

    this.subFeatures = ((_config$subFeatures = config.subFeatures) !== null && _config$subFeatures !== void 0 ? _config$subFeatures : []).map(subFeatureConfig => new _sub_feature.SubFeature(subFeatureConfig));
  }

  get id() {
    return this.config.id;
  }

  get name() {
    return this.config.name;
  }

  get order() {
    return this.config.order;
  }

  get category() {
    return this.config.category;
  }

  get app() {
    return this.config.app;
  }

  get catalogue() {
    return this.config.catalogue;
  }

  get management() {
    return this.config.management;
  }

  get minimumLicense() {
    return this.config.minimumLicense;
  }

  get privileges() {
    return this.config.privileges;
  }

  get alerting() {
    return this.config.alerting;
  }

  get excludeFromBasePrivileges() {
    var _this$config$excludeF;

    return (_this$config$excludeF = this.config.excludeFromBasePrivileges) !== null && _this$config$excludeF !== void 0 ? _this$config$excludeF : false;
  }

  get reserved() {
    return this.config.reserved;
  }

  toRaw() {
    return { ...this.config
    };
  }

}

exports.KibanaFeature = KibanaFeature;