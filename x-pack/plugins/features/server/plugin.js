"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FeaturesPlugin = void 0;

var _std = require("@kbn/std");

var _feature_registry = require("./feature_registry");

var _ui_capabilities_for_features = require("./ui_capabilities_for_features");

var _oss_features = require("./oss_features");

var _routes = require("./routes");

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
/**
 * Represents Features Plugin instance that will be managed by the Kibana plugin system.
 */


class FeaturesPlugin {
  constructor(initializerContext) {
    this.initializerContext = initializerContext;

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "featureRegistry", new _feature_registry.FeatureRegistry());

    _defineProperty(this, "isTimelionEnabled", false);

    this.logger = this.initializerContext.logger.get();
  }

  setup(core, {
    visTypeTimelion
  }) {
    this.isTimelionEnabled = visTypeTimelion !== undefined && visTypeTimelion.uiEnabled;
    (0, _routes.defineRoutes)({
      router: core.http.createRouter(),
      featureRegistry: this.featureRegistry
    });

    const getFeaturesUICapabilities = () => (0, _ui_capabilities_for_features.uiCapabilitiesForFeatures)(this.featureRegistry.getAllKibanaFeatures(), this.featureRegistry.getAllElasticsearchFeatures());

    core.capabilities.registerProvider(getFeaturesUICapabilities);
    return (0, _std.deepFreeze)({
      registerKibanaFeature: this.featureRegistry.registerKibanaFeature.bind(this.featureRegistry),
      registerElasticsearchFeature: this.featureRegistry.registerElasticsearchFeature.bind(this.featureRegistry),
      getKibanaFeatures: this.featureRegistry.getAllKibanaFeatures.bind(this.featureRegistry),
      getElasticsearchFeatures: this.featureRegistry.getAllElasticsearchFeatures.bind(this.featureRegistry),
      getFeaturesUICapabilities
    });
  }

  start(core) {
    this.registerOssFeatures(core.savedObjects);
    return (0, _std.deepFreeze)({
      getElasticsearchFeatures: this.featureRegistry.getAllElasticsearchFeatures.bind(this.featureRegistry),
      getKibanaFeatures: this.featureRegistry.getAllKibanaFeatures.bind(this.featureRegistry)
    });
  }

  stop() {}

  registerOssFeatures(savedObjects) {
    const registry = savedObjects.getTypeRegistry();
    const savedObjectTypes = registry.getVisibleTypes().map(t => t.name);
    this.logger.debug(`Registering OSS features with SO types: ${savedObjectTypes.join(', ')}. "includeTimelion": ${this.isTimelionEnabled}.`);
    const features = (0, _oss_features.buildOSSFeatures)({
      savedObjectTypes,
      includeTimelion: this.isTimelionEnabled
    });

    for (const feature of features) {
      this.featureRegistry.registerKibanaFeature(feature);
    }
  }

}

exports.FeaturesPlugin = FeaturesPlugin;