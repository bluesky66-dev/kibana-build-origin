"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimelionPlugin = void 0;

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _std = require("@kbn/std");

var _load_functions = _interopRequireDefault(require("./lib/load_functions"));

var _functions = require("./routes/functions");

var _validate_es = require("./routes/validate_es");

var _run = require("./routes/run");

var _config_manager = require("./lib/config_manager");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const experimentalLabel = _i18n.i18n.translate('timelion.uiSettings.experimentalLabel', {
  defaultMessage: 'experimental'
});
/**
 * Describes public Timelion plugin contract returned at the `setup` stage.
 */


/**
 * Represents Timelion Plugin instance that will be managed by the Kibana plugin system.
 */
class TimelionPlugin {
  constructor(initializerContext) {
    this.initializerContext = initializerContext;
  }

  setup(core) {
    const config = this.initializerContext.config.get();
    const configManager = new _config_manager.ConfigManager(this.initializerContext.config);
    const functions = (0, _load_functions.default)('series_functions');

    const getFunction = name => {
      if (functions[name]) {
        return functions[name];
      }

      throw new Error(_i18n.i18n.translate('timelion.noFunctionErrorMessage', {
        defaultMessage: 'No such function: {name}',
        values: {
          name
        }
      }));
    };

    const logger = this.initializerContext.logger.get('timelion');
    const router = core.http.createRouter();
    const deps = {
      configManager,
      functions,
      getFunction,
      logger,
      core
    };
    (0, _functions.functionsRoute)(router, deps);
    (0, _run.runRoute)(router, deps);
    (0, _validate_es.validateEsRoute)(router);
    core.uiSettings.register({
      'timelion:es.timefield': {
        name: _i18n.i18n.translate('timelion.uiSettings.timeFieldLabel', {
          defaultMessage: 'Time field'
        }),
        value: '@timestamp',
        description: _i18n.i18n.translate('timelion.uiSettings.timeFieldDescription', {
          defaultMessage: 'Default field containing a timestamp when using {esParam}',
          values: {
            esParam: '.es()'
          }
        }),
        category: ['timelion'],
        schema: _configSchema.schema.string()
      },
      'timelion:es.default_index': {
        name: _i18n.i18n.translate('timelion.uiSettings.defaultIndexLabel', {
          defaultMessage: 'Default index'
        }),
        value: '_all',
        description: _i18n.i18n.translate('timelion.uiSettings.defaultIndexDescription', {
          defaultMessage: 'Default elasticsearch index to search with {esParam}',
          values: {
            esParam: '.es()'
          }
        }),
        category: ['timelion'],
        schema: _configSchema.schema.string()
      },
      'timelion:target_buckets': {
        name: _i18n.i18n.translate('timelion.uiSettings.targetBucketsLabel', {
          defaultMessage: 'Target buckets'
        }),
        value: 200,
        description: _i18n.i18n.translate('timelion.uiSettings.targetBucketsDescription', {
          defaultMessage: 'The number of buckets to shoot for when using auto intervals'
        }),
        category: ['timelion'],
        schema: _configSchema.schema.number()
      },
      'timelion:max_buckets': {
        name: _i18n.i18n.translate('timelion.uiSettings.maximumBucketsLabel', {
          defaultMessage: 'Maximum buckets'
        }),
        value: 2000,
        description: _i18n.i18n.translate('timelion.uiSettings.maximumBucketsDescription', {
          defaultMessage: 'The maximum number of buckets a single datasource can return'
        }),
        category: ['timelion'],
        schema: _configSchema.schema.number()
      },
      'timelion:min_interval': {
        name: _i18n.i18n.translate('timelion.uiSettings.minimumIntervalLabel', {
          defaultMessage: 'Minimum interval'
        }),
        value: '1ms',
        description: _i18n.i18n.translate('timelion.uiSettings.minimumIntervalDescription', {
          defaultMessage: 'The smallest interval that will be calculated when using "auto"',
          description: '"auto" is a technical value in that context, that should not be translated.'
        }),
        category: ['timelion'],
        schema: _configSchema.schema.string()
      },
      'timelion:graphite.url': {
        name: _i18n.i18n.translate('timelion.uiSettings.graphiteURLLabel', {
          defaultMessage: 'Graphite URL',
          description: 'The URL should be in the form of https://www.hostedgraphite.com/UID/ACCESS_KEY/graphite'
        }),
        value: config.graphiteUrls && config.graphiteUrls.length ? config.graphiteUrls[0] : null,
        description: _i18n.i18n.translate('timelion.uiSettings.graphiteURLDescription', {
          defaultMessage: '{experimentalLabel} The <a href="https://www.hostedgraphite.com/UID/ACCESS_KEY/graphite" target="_blank" rel="noopener">URL</a> of your graphite host',
          values: {
            experimentalLabel: `<em>[${experimentalLabel}]</em>`
          }
        }),
        type: 'select',
        options: config.graphiteUrls || [],
        category: ['timelion'],
        schema: _configSchema.schema.nullable(_configSchema.schema.string())
      },
      'timelion:quandl.key': {
        name: _i18n.i18n.translate('timelion.uiSettings.quandlKeyLabel', {
          defaultMessage: 'Quandl key'
        }),
        value: 'someKeyHere',
        description: _i18n.i18n.translate('timelion.uiSettings.quandlKeyDescription', {
          defaultMessage: '{experimentalLabel} Your API key from www.quandl.com',
          values: {
            experimentalLabel: `<em>[${experimentalLabel}]</em>`
          }
        }),
        sensitive: true,
        category: ['timelion'],
        schema: _configSchema.schema.string()
      }
    });
    return (0, _std.deepFreeze)({
      uiEnabled: config.ui.enabled
    });
  }

  start() {
    this.initializerContext.logger.get().debug('Starting plugin');
  }

  stop() {
    this.initializerContext.logger.get().debug('Stopping plugin');
  }

}

exports.TimelionPlugin = TimelionPlugin;