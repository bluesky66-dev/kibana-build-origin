"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoggingService = void 0;

var _logging_config = require("./logging_config");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/** @internal */
class LoggingService {
  constructor(coreContext) {
    _defineProperty(this, "subscriptions", new Map());

    _defineProperty(this, "log", void 0);

    this.log = coreContext.logger.get('logging');
  }

  setup({
    loggingSystem
  }) {
    return {
      configure: (contextParts, config$) => {
        const contextName = _logging_config.LoggingConfig.getLoggerContext(contextParts);

        this.log.debug(`Setting custom config for context [${contextName}]`);
        const existingSubscription = this.subscriptions.get(contextName);

        if (existingSubscription) {
          existingSubscription.unsubscribe();
        } // Might be fancier way to do this with rxjs, but this works and is simple to understand


        this.subscriptions.set(contextName, config$.subscribe(config => {
          this.log.debug(`Updating logging config for context [${contextName}]`);
          loggingSystem.setContextConfig(contextParts, config);
        }));
      }
    };
  }

  start() {}

  stop() {
    for (const [, subscription] of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}

exports.LoggingService = LoggingService;