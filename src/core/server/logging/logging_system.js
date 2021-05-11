"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoggingSystem = void 0;

var _logging = require("@kbn/logging");

var _appenders = require("./appenders/appenders");

var _buffer_appender = require("./appenders/buffer/buffer_appender");

var _logger = require("./logger");

var _logger_adapter = require("./logger_adapter");

var _logging_config = require("./logging_config");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * System that is responsible for maintaining loggers and logger appenders.
 * @internal
 */
class LoggingSystem {
  /** The configuration set by the user. */

  /** The fully computed configuration extended by context-specific configurations set programmatically */
  constructor() {
    _defineProperty(this, "baseConfig", void 0);

    _defineProperty(this, "computedConfig", void 0);

    _defineProperty(this, "appenders", new Map());

    _defineProperty(this, "bufferAppender", new _buffer_appender.BufferAppender());

    _defineProperty(this, "loggers", new Map());

    _defineProperty(this, "contextConfigs", new Map());
  }

  get(...contextParts) {
    const context = _logging_config.LoggingConfig.getLoggerContext(contextParts);

    if (!this.loggers.has(context)) {
      this.loggers.set(context, new _logger_adapter.LoggerAdapter(this.createLogger(context, this.computedConfig)));
    }

    return this.loggers.get(context);
  }
  /**
   * Safe wrapper that allows passing logging service as immutable LoggerFactory.
   */


  asLoggerFactory() {
    return {
      get: (...contextParts) => this.get(...contextParts)
    };
  }
  /**
   * Updates all current active loggers with the new config values.
   * @param rawConfig New config instance. if unspecified, the default logging configuration
   *                  will be used.
   */


  async upgrade(rawConfig) {
    const usedConfig = rawConfig !== null && rawConfig !== void 0 ? rawConfig : _logging_config.config.schema.validate({});
    const config = new _logging_config.LoggingConfig(usedConfig);
    await this.applyBaseConfig(config);
  }
  /**
   * Customizes the logging config for a specific context.
   *
   * @remarks
   * Assumes that that the `context` property of the individual items in `rawConfig.loggers`
   * are relative to the `baseContextParts`.
   *
   * @example
   * Customize the configuration for the plugins.data.search context.
   * ```ts
   * loggingSystem.setContextConfig(
   *   ['plugins', 'data'],
   *   {
   *     loggers: [{ name: 'search', appenders: ['default'] }]
   *   }
   * )
   * ```
   *
   * @param baseContextParts
   * @param rawConfig
   */


  async setContextConfig(baseContextParts, rawConfig) {
    const context = _logging_config.LoggingConfig.getLoggerContext(baseContextParts);

    const contextConfig = _logging_config.loggerContextConfigSchema.validate(rawConfig);

    this.contextConfigs.set(context, { ...contextConfig,
      // Automatically prepend the base context to the logger sub-contexts
      loggers: contextConfig.loggers.map(l => ({ ...l,
        name: _logging_config.LoggingConfig.getLoggerContext(l.name.length > 0 ? [context, l.name] : [context])
      }))
    }); // If we already have a base config, apply the config. If not, custom context configs
    // will be picked up on next call to `upgrade`.

    if (this.baseConfig) {
      await this.applyBaseConfig(this.baseConfig);
    }
  }
  /**
   * Disposes all loggers (closes log files, clears buffers etc.). Service is not usable after
   * calling of this method until new config is provided via `upgrade` method.
   * @returns Promise that is resolved once all loggers are successfully disposed.
   */


  async stop() {
    await Promise.all([...this.appenders.values()].map(a => a.dispose()));
    await this.bufferAppender.dispose();
    this.appenders.clear();
    this.loggers.clear();
  }

  createLogger(context, config) {
    if (config === undefined) {
      // If we don't have config yet, use `buffered` appender that will store all logged messages in the memory
      // until the config is ready.
      return new _logger.BaseLogger(context, _logging.LogLevel.All, [this.bufferAppender], this.asLoggerFactory());
    }

    const {
      level,
      appenders
    } = this.getLoggerConfigByContext(config, context);

    const loggerLevel = _logging.LogLevel.fromId(level);

    const loggerAppenders = appenders.map(appenderKey => this.appenders.get(appenderKey));
    return new _logger.BaseLogger(context, loggerLevel, loggerAppenders, this.asLoggerFactory());
  }

  getLoggerConfigByContext(config, context) {
    const loggerConfig = config.loggers.get(context);

    if (loggerConfig !== undefined) {
      return loggerConfig;
    } // If we don't have configuration for the specified context and it's the "nested" one (eg. `foo.bar.baz`),
    // let's move up to the parent context (eg. `foo.bar`) and check if it has config we can rely on. Otherwise
    // we fallback to the `root` context that should always be defined (enforced by configuration schema).


    return this.getLoggerConfigByContext(config, _logging_config.LoggingConfig.getParentLoggerContext(context));
  }

  async applyBaseConfig(newBaseConfig) {
    const computedConfig = [...this.contextConfigs.values()].reduce((baseConfig, contextConfig) => baseConfig.extend(contextConfig), newBaseConfig); // reconfigure all the loggers without configuration to have them use the buffer
    // appender while we are awaiting for the appenders to be disposed.

    for (const [loggerKey, loggerAdapter] of this.loggers) {
      loggerAdapter.updateLogger(this.createLogger(loggerKey, undefined));
    } // Appenders must be reset, so we first dispose of the current ones, then
    // build up a new set of appenders.


    await Promise.all([...this.appenders.values()].map(a => a.dispose()));
    this.appenders.clear();

    for (const [appenderKey, appenderConfig] of computedConfig.appenders) {
      this.appenders.set(appenderKey, _appenders.Appenders.create(appenderConfig));
    }

    for (const [loggerKey, loggerAdapter] of this.loggers) {
      loggerAdapter.updateLogger(this.createLogger(loggerKey, computedConfig));
    } // We keep a reference to the base config so we can properly extend it
    // on each config change.


    this.baseConfig = newBaseConfig;
    this.computedConfig = computedConfig; // Re-log all buffered log records with newly configured appenders.

    for (const logRecord of this.bufferAppender.flush()) {
      this.get(logRecord.context).log(logRecord);
    }
  }

}

exports.LoggingSystem = LoggingSystem;