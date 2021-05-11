"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimelionPlugin = void 0;

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _saved_objects = require("./saved_objects");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Deprecated since 7.0, the Timelion app will be removed in 8.0.
 * To continue using your Timelion worksheets, migrate them to a dashboard.
 *
 *  @link https://www.elastic.co/guide/en/kibana/master/timelion.html#timelion-deprecation
 **/
const showWarningMessageIfTimelionSheetWasFound = (core, logger) => {
  const {
    savedObjects
  } = core;
  const savedObjectsClient = savedObjects.createInternalRepository();
  savedObjectsClient.find({
    type: 'timelion-sheet',
    perPage: 1
  }).then(({
    total
  }) => total && logger.warn('Deprecated since 7.0, the Timelion app will be removed in 8.0. To continue using your Timelion worksheets, migrate them to a dashboard. See https://www.elastic.co/guide/en/kibana/current/create-panels-with-timelion.html.'));
};

class TimelionPlugin {
  constructor(context) {
    _defineProperty(this, "logger", void 0);

    this.logger = context.logger.get();
  }

  setup(core) {
    core.capabilities.registerProvider(() => ({
      timelion: {
        save: true
      }
    }));
    core.savedObjects.registerType(_saved_objects.timelionSheetSavedObjectType);
    core.uiSettings.register({
      'timelion:showTutorial': {
        name: _i18n.i18n.translate('timelion.uiSettings.showTutorialLabel', {
          defaultMessage: 'Show tutorial'
        }),
        value: false,
        description: _i18n.i18n.translate('timelion.uiSettings.showTutorialDescription', {
          defaultMessage: 'Should I show the tutorial by default when entering the timelion app?'
        }),
        category: ['timelion'],
        schema: _configSchema.schema.boolean()
      },
      'timelion:default_columns': {
        name: _i18n.i18n.translate('timelion.uiSettings.defaultColumnsLabel', {
          defaultMessage: 'Default columns'
        }),
        value: 2,
        description: _i18n.i18n.translate('timelion.uiSettings.defaultColumnsDescription', {
          defaultMessage: 'Number of columns on a timelion sheet by default'
        }),
        category: ['timelion'],
        schema: _configSchema.schema.number()
      },
      'timelion:default_rows': {
        name: _i18n.i18n.translate('timelion.uiSettings.defaultRowsLabel', {
          defaultMessage: 'Default rows'
        }),
        value: 2,
        description: _i18n.i18n.translate('timelion.uiSettings.defaultRowsDescription', {
          defaultMessage: 'Number of rows on a timelion sheet by default'
        }),
        category: ['timelion'],
        schema: _configSchema.schema.number()
      }
    });
  }

  start(core) {
    showWarningMessageIfTimelionSheetWasFound(core, this.logger);
  }

  stop() {}

}

exports.TimelionPlugin = TimelionPlugin;