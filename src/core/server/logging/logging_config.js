"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoggingConfig = exports.loggerContextConfigSchema = exports.config = exports.loggerSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _appenders = require("./appenders/appenders");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// We need this helper for the types to be correct
// (otherwise it assumes an array of A|B instead of a tuple [A,B])
const toTuple = (a, b) => [a, b];
/**
 * Separator string that used within nested context name (eg. plugins.pid).
 */


const CONTEXT_SEPARATOR = '.';
/**
 * Name of the `root` context that always exists and sits at the top of logger hierarchy.
 */

const ROOT_CONTEXT_NAME = 'root';
/**
 * Name of the appender that is always presented and used by `root` logger by default.
 */

const DEFAULT_APPENDER_NAME = 'default';

const levelSchema = _configSchema.schema.oneOf([_configSchema.schema.literal('all'), _configSchema.schema.literal('fatal'), _configSchema.schema.literal('error'), _configSchema.schema.literal('warn'), _configSchema.schema.literal('info'), _configSchema.schema.literal('debug'), _configSchema.schema.literal('trace'), _configSchema.schema.literal('off')], {
  defaultValue: 'info'
});
/**
 * Config schema for validating the `loggers` key in {@link LoggerContextConfigType} or {@link LoggingConfigType}.
 *
 * @public
 */


const loggerSchema = _configSchema.schema.object({
  appenders: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: []
  }),
  name: _configSchema.schema.string(),
  level: levelSchema
});
/** @public */


exports.loggerSchema = loggerSchema;
const config = {
  path: 'logging',
  schema: _configSchema.schema.object({
    appenders: _configSchema.schema.mapOf(_configSchema.schema.string(), _appenders.Appenders.configSchema, {
      defaultValue: new Map()
    }),
    loggers: _configSchema.schema.arrayOf(loggerSchema, {
      defaultValue: []
    }),
    root: _configSchema.schema.object({
      appenders: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
        defaultValue: [DEFAULT_APPENDER_NAME],
        minSize: 1
      }),
      level: levelSchema
    }, {
      validate(rawConfig) {
        if (!rawConfig.appenders.includes(DEFAULT_APPENDER_NAME)) {
          return `"${DEFAULT_APPENDER_NAME}" appender required for migration period till the next major release`;
        }
      }

    })
  })
};
exports.config = config;

/**
 * Config schema for validating the inputs to the {@link LoggingServiceStart.configure} API.
 * See {@link LoggerContextConfigType}.
 *
 * @public
 */
const loggerContextConfigSchema = _configSchema.schema.object({
  appenders: _configSchema.schema.mapOf(_configSchema.schema.string(), _appenders.Appenders.configSchema, {
    defaultValue: new Map()
  }),
  loggers: _configSchema.schema.arrayOf(loggerSchema, {
    defaultValue: []
  })
});
/** @public */


exports.loggerContextConfigSchema = loggerContextConfigSchema;

/**
 * Describes the config used to fully setup logging subsystem.
 * @internal
 */
class LoggingConfig {
  /**
   * Helper method that joins separate string context parts into single context string.
   * In case joined context is an empty string, `root` context name is returned.
   * @param contextParts List of the context parts (e.g. ['parent', 'child'].
   * @returns {string} Joined context string (e.g. 'parent.child').
   */
  static getLoggerContext(contextParts) {
    return contextParts.join(CONTEXT_SEPARATOR) || ROOT_CONTEXT_NAME;
  }
  /**
   * Helper method that returns parent context for the specified one.
   * @param context Context to find parent for.
   * @returns Name of the parent context or `root` if the context is the top level one.
   */


  static getParentLoggerContext(context) {
    const lastIndexOfSeparator = context.lastIndexOf(CONTEXT_SEPARATOR);

    if (lastIndexOfSeparator === -1) {
      return ROOT_CONTEXT_NAME;
    }

    return context.slice(0, lastIndexOfSeparator);
  }
  /**
   * Map of the appender unique arbitrary key and its corresponding config.
   */


  constructor(configType) {
    this.configType = configType;

    _defineProperty(this, "appenders", new Map([['default', {
      type: 'console',
      layout: {
        type: 'pattern',
        highlight: true
      }
    }], ['console', {
      type: 'console',
      layout: {
        type: 'pattern',
        highlight: true
      }
    }]]));

    _defineProperty(this, "loggers", new Map());

    this.fillAppendersConfig(configType);
    this.fillLoggersConfig(configType);
  }
  /**
   * Returns a new LoggingConfig that merges the existing config with the specified config.
   *
   * @remarks
   * Does not support merging the `root` config property.
   *
   * @param contextConfig
   */


  extend(contextConfig) {
    // Use a Map to de-dupe any loggers for the same context. contextConfig overrides existing config.
    const mergedLoggers = new Map([...this.configType.loggers.map(l => [l.name, l]), ...contextConfig.loggers.map(l => [l.name, l])]);
    const mergedConfig = {
      appenders: new Map([...this.configType.appenders, ...contextConfig.appenders]),
      loggers: [...mergedLoggers.values()],
      root: this.configType.root
    };
    return new LoggingConfig(mergedConfig);
  }

  fillAppendersConfig(loggingConfig) {
    for (const [appenderKey, appenderSchema] of loggingConfig.appenders) {
      this.appenders.set(appenderKey, appenderSchema);
    }
  }

  fillLoggersConfig(loggingConfig) {
    // Include `root` logger into common logger list so that it can easily be a part
    // of the logger hierarchy and put all the loggers in map for easier retrieval.
    const loggers = [{
      name: ROOT_CONTEXT_NAME,
      ...loggingConfig.root
    }, ...loggingConfig.loggers];
    const loggerConfigByContext = new Map(loggers.map(loggerConfig => toTuple(loggerConfig.name, loggerConfig)));

    for (const [loggerContext, loggerConfig] of loggerConfigByContext) {
      // Ensure logger config only contains valid appenders.
      const unsupportedAppenderKey = loggerConfig.appenders.find(appenderKey => !this.appenders.has(appenderKey));

      if (unsupportedAppenderKey) {
        throw new Error(`Logger "${loggerContext}" contains unsupported appender key "${unsupportedAppenderKey}".`);
      }

      const appenders = getAppenders(loggerConfig, loggerConfigByContext); // We expect `appenders` to never be empty at this point, since the `root` context config should always
      // have at least one appender that is enforced by the config schema validation.

      this.loggers.set(loggerContext, { ...loggerConfig,
        appenders
      });
    }
  }

}
/**
 * Get appenders for logger config.
 *
 * If config for current context doesn't have any defined appenders inherit
 * appenders from the parent context config.
 */


exports.LoggingConfig = LoggingConfig;

function getAppenders(loggerConfig, loggerConfigByContext) {
  let currentContext = loggerConfig.name;
  let appenders = loggerConfig.appenders;

  while (appenders.length === 0) {
    const parentContext = LoggingConfig.getParentLoggerContext(currentContext);
    const parentLogger = loggerConfigByContext.get(parentContext);

    if (parentLogger) {
      appenders = parentLogger.appenders;
    }

    currentContext = parentContext;
  }

  return appenders;
}