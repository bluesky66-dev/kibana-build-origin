"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VisualizationsPlugin = void 0;

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _constants = require("../common/constants");

var _saved_objects = require("./saved_objects");

var _usage_collector = require("./usage_collector");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class VisualizationsPlugin {
  constructor(initializerContext) {
    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "config", void 0);

    this.logger = initializerContext.logger.get();
    this.config = initializerContext.config.legacy.globalConfig$;
  }

  setup(core, plugins) {
    this.logger.debug('visualizations: Setup');
    core.savedObjects.registerType(_saved_objects.visualizationSavedObjectType);
    core.uiSettings.register({
      [_constants.VISUALIZE_ENABLE_LABS_SETTING]: {
        name: _i18n.i18n.translate('visualizations.advancedSettings.visualizeEnableLabsTitle', {
          defaultMessage: 'Enable experimental visualizations'
        }),
        value: true,
        description: _i18n.i18n.translate('visualizations.advancedSettings.visualizeEnableLabsText', {
          defaultMessage: `Allows users to create, view, and edit experimental visualizations. If disabled,
            only visualizations that are considered production-ready are available to the user.`
        }),
        category: ['visualization'],
        schema: _configSchema.schema.boolean()
      }
    });

    if (plugins.usageCollection) {
      (0, _usage_collector.registerVisualizationsCollector)(plugins.usageCollection, this.config);
    }

    return {};
  }

  start(core) {
    this.logger.debug('visualizations: Started');
    return {};
  }

  stop() {}

}

exports.VisualizationsPlugin = VisualizationsPlugin;