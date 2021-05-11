"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventLogClientService = void 0;

var _event_log_client = require("./event_log_client");

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


class EventLogClientService {
  constructor({
    esContext,
    savedObjectProviderRegistry,
    spacesService
  }) {
    _defineProperty(this, "esContext", void 0);

    _defineProperty(this, "savedObjectProviderRegistry", void 0);

    _defineProperty(this, "spacesService", void 0);

    this.esContext = esContext;
    this.savedObjectProviderRegistry = savedObjectProviderRegistry;
    this.spacesService = spacesService;
  }

  getClient(request) {
    return new _event_log_client.EventLogClient({
      esContext: this.esContext,
      savedObjectGetter: this.savedObjectProviderRegistry.getProvidersClient(request),
      spacesService: this.spacesService,
      request
    });
  }

}

exports.EventLogClientService = EventLogClientService;