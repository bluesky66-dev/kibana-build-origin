"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventLogService = void 0;

var _event_logger = require("./event_logger");

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
} // note that clusterClient may be null, indicating we can't write to ES


class EventLogService {
  constructor({
    config,
    esContext,
    kibanaUUID,
    systemLogger,
    savedObjectProviderRegistry
  }) {
    _defineProperty(this, "config", void 0);

    _defineProperty(this, "esContext", void 0);

    _defineProperty(this, "systemLogger", void 0);

    _defineProperty(this, "registeredProviderActions", void 0);

    _defineProperty(this, "savedObjectProviderRegistry", void 0);

    _defineProperty(this, "kibanaUUID", void 0);

    this.config = config;
    this.esContext = esContext;
    this.kibanaUUID = kibanaUUID;
    this.systemLogger = systemLogger;
    this.registeredProviderActions = new Map();
    this.savedObjectProviderRegistry = savedObjectProviderRegistry;
  }

  isEnabled() {
    return this.config.enabled;
  }

  isLoggingEntries() {
    return this.isEnabled() && this.config.logEntries;
  }

  isIndexingEntries() {
    return this.isEnabled() && this.config.indexEntries;
  }

  registerProviderActions(provider, actions) {
    if (actions.length === 0) {
      throw new Error(`actions parameter must not be empty for provider: "${provider}"`);
    }

    if (this.registeredProviderActions.has(provider)) {
      throw new Error(`provider already registered: "${provider}"`);
    }

    this.registeredProviderActions.set(provider, new Set(actions));
  }

  isProviderActionRegistered(provider, action) {
    const actions = this.registeredProviderActions.get(provider);
    if (actions == null) return false;
    if (actions.has(action)) return true;
    return false;
  }

  getProviderActions() {
    return new Map(this.registeredProviderActions.entries());
  }

  registerSavedObjectProvider(type, provider) {
    return this.savedObjectProviderRegistry.registerProvider(type, provider);
  }

  getLogger(initialProperties) {
    return new _event_logger.EventLogger({
      esContext: this.esContext,
      eventLogService: this,
      initialProperties,
      systemLogger: this.systemLogger
    });
  }

}

exports.EventLogService = EventLogService;